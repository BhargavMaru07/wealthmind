import arcjet, { tokenBucket } from "@arcjet/next";

const aj = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics:["userId"], //Track based on Clerk userId
  rules:[
    tokenBucket({
        mode:"LIVE",
        refillRate:10,  // after every hour 10 request added in bucket
        interval:3600,  //one hour interval
        capacity:10    //10 request in one hour
    })
  ]
});


export default aj