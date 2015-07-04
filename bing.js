var Bing = require('node-bing-api')({ accKey: "l11l8D4FBj6XkyHh3NzeMINbdY+s19eUoxrRgvgQQgQ" });
//web search
// Bing.web("Royal Challengers Bangalore", {
//     top: 10,  // Number of results (max 50) 
//     skip: 3,   // Skip first 3 results 
//   }, function(error, res, body){
//     console.log(body);
//     console.log(body.d.results[9]);
//   });

//composite search
// Bing.composite("xbox", {
//     top: 10,  // Number of results (max 50) 
//     skip: 3,   // Skip first 3 results 
//     sources: "web+news", //Choises are web+image+video+news+spell 
//     newssortby: "Date" //Choices are Date, Relevance 
//   }, function(error, res, body){
//     console.log(body);
//   });

//news search
Bing.news("RCB", {
    top: 10,  // Number of results (max 50) 
    skip: 3,   // Skip first 3 results 
    newssortby: "Date", //Choices are: Date, Relevance 
    newscategory: "rt_Sports" // Choices are: 
                                //   rt_Business 
                                //   rt_Entertainment 
                                //   rt_Health 
                                //   rt_Politics 
                                //   rt_Sports 
                                //   rt_US 
                                //   rt_World 
                                //   rt_ScienceAndTechnology 
  }, function(error, res, body){
    console.log(body.d.results[3]);
  });

//video search
// Bing.video("monkey vs frog", {
//     top: 10,  // Number of results (max 50) 
//     skip: 3,   // Skip first 3 result 
//     videofilters: {
//       duration: 'short',
//       resolution: 'high'
//     }
//   }, function(error, res, body){
//     console.log(body);
//   });


//images search
// Bing.images("Ninja Turtles", {skip: 50}, function(error, res, body){
//   console.log(body);
// });	
