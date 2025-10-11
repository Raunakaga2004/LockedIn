import axios from "axios";

export default async function getUser() {
  try{
    const res = await axios
    .get(`${import.meta.env.VITE_URL}/user`, {
      withCredentials: true,
    })

    return res.data;
  }
  catch(e){
    console.error("user not found!");
  }
}
