import cron from 'node-cron'

import prisma from '../config/prisma'
import { WeekDays } from '../generated/prisma';

async function recurrenceFunction(){
  try {
    const now = new Date(); //  current date and time
    const localDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 1); // 12:01 AM

    const today = now.toISOString().split('T')[0]; // get in the format of YYYY-MM-DD

    const Allrecurrences = await prisma.recurrence.findMany({
      where: {
        is_active : true,
        start_date : {lte : localDate}, //less than or equal to 
        OR : [
          {end_date : null},
          {end_date : {gte : localDate}}, // greater than or equal to
        ],
        delete : false
      },
    })

    const recurrencesTemp = Allrecurrences.filter((rec) => {
      return !rec.exceptions?.some(date => date.toISOString().split('T')[0] === today) // if exceptions has the today in any date skip it 
    })

    const recurrences = (await Promise.all(
      recurrencesTemp.map(async (rec) => {
        if(rec.frequency === 'daily'){
          if(rec.last_occurence){
            const lastOccur = new Date(rec.last_occurence); // converts into datetime for ts from prisma datetime

            const interval = rec.interval * 1; // because daily

            const nextOccurDate = new Date(lastOccur);

            // add inteval days
            nextOccurDate.setDate(nextOccurDate.getDate() + interval);

            //converts to string and take date out of it
            const nextDateString = nextOccurDate.toISOString().split('T')[0];

            if(nextDateString !== today){
              return null;
            }
          }

          //update the last_occurence
          await prisma.recurrence.update({
            where : {
              id : rec.id
            }, data : {
              last_occurence : localDate,
              occurence_count : rec.occurence_count ? rec.occurence_count + 1 : 1
            }
          })

          return rec;
        }

        else if(rec.frequency === 'weekly'){
          // getting this weeks sunday
          const day = now.getDay(); // sunday = 0

          const thisWeek = new Date(localDate);
          thisWeek.setDate(thisWeek.getDate() - day); // we will get sunday

          const thisWeekString = thisWeek.toISOString().split('T')[0];

          if(rec.last_occurence){
            const lastOccur = rec.last_occurence;
            // always sunday of that will be stored in this

            const interval = rec.interval * 7; // becuase it is weekly
            
            const nextOccurDate = new Date(lastOccur);

            // add interval
            nextOccurDate.setDate(nextOccurDate.getDate() + interval);

            // next week string
            const nextWeekString = nextOccurDate.toISOString().split('T')[0];

            if(thisWeekString !== nextWeekString) return null;
          }

          const week_days = rec.days_of_week;

          //todays day
          const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

          const todayDay = dayNames[now.getDay()] as keyof typeof WeekDays; // convert into enum type

          if(week_days.includes(todayDay)){

            //update the last_occurence
            await prisma.recurrence.update({
              where : {
                id : rec.id
              }, data : {
                last_occurence : thisWeek, //  store this week sunday
                occurence_count : rec.occurence_count ? rec.occurence_count + 1 : 1
              }
            })

            return rec;
          }
          else return null;
        }

        else if (rec.frequency === 'monthly'){
          if(rec.last_occurence){
            const lastOccur = new Date(rec.last_occurence); // converts into datetime for ts from prisma datetime

            const date = lastOccur.getDate();

            const nextOccurDate = new Date(lastOccur);

            const interval = rec.interval; // skip interval months

            // add inteval days
            nextOccurDate.setMonth(nextOccurDate.getMonth() + interval);

            if(nextOccurDate.getDate() < date){
              nextOccurDate.setDate(0);
            }

            //converts to string and take date out of it
            const nextDateString = nextOccurDate.toISOString().split('T')[0];

            if(nextDateString !== today){
              return null;
            }
          }

          //update the last_occurence
          await prisma.recurrence.update({
            where : {
              id : rec.id
            }, data : {
              last_occurence : localDate,
              occurence_count : rec.occurence_count ? rec.occurence_count + 1 : 1
            }
          })

          return rec;
        }
        
        else if(rec.frequency === 'yearly'){
          if(rec.last_occurence){
            const lastOccur = new Date(rec.last_occurence); // converts into datetime for ts from prisma datetime

            const nextOccurDate = new Date(lastOccur);

            const interval = rec.interval; // skip interval years

            // add inteval days
            nextOccurDate.setFullYear(nextOccurDate.getFullYear() + interval);

            //converts to string and take date out of it
            const nextDateString = nextOccurDate.toISOString().split('T')[0];

            if(nextDateString !== today){
              return null;
            }
          }

          //update the last_occurence
          await prisma.recurrence.update({
            where : {
              id : rec.id
            }, data : {
              last_occurence : localDate,
              occurence_count : rec.occurence_count ? rec.occurence_count + 1 : 1
            }
          })

          return rec;
        }
      })
    )).filter(Boolean); // removes all 'null' values


    // now recurrence table is updated now we need to add all task from recurrences

    //get base task first 
    
    for(const recurrence of recurrences){
      if(!recurrence) continue;

      const baseTask = await prisma.task.findFirst({
        where : {
          recurrence_id : recurrence.id 
        }
      })

      if(!baseTask) continue;

      const data : any = {};

      data.user_id = baseTask.user_id;
      data.title = baseTask.title;
      data.type = baseTask.type;
      data.status = baseTask.status;
      data.recurrence_id = baseTask.recurrence_id;

      if(baseTask.description){
        data.description = baseTask.description
      }

      if(baseTask.urgent){
        data.urgent = baseTask.urgent
      }

      if(baseTask.important){
        data.important = baseTask.important
      }

      if(baseTask.expected_pomodoro){
        data.expected_pomodoro = baseTask.expected_pomodoro
      }

      await prisma.task.create({
        data : data
      })
    }

    console.log('✅ Recurring Tasks added Successfully!!')
  }
  catch(e){
    console.error('❌ Error in recurrence cron job:', e);
  }
}

async function habitFunction(){
  try{



    console.log('✅ Habits added Successfully!!')
  }
  catch(e){
    console.error('❌ Error in habit cron job:', e);
  }
}

cron.schedule('1 0 * * *', async () => { // runs at 12 : 01 AM exactly everyday
  await recurrenceFunction();
  await habitFunction();
})