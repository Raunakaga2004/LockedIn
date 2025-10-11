import axios from 'axios'

export default async function getUser(){
  await axios.get(`$URL${}`)
}