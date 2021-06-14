const axios = require("axios");
const fs = require("fs");

// var readlinsync = require("readline-sync")



axios.get("http://saral.navgurukul.org/api/courses").then( (result) => {
    var ArrayData = result.data["availableCourses"]
    
    var str_data = JSON.stringify(ArrayData, null, 4)
    
    const prom1 = new Promise ((resolve, reject) => {
        setTimeout(() => {
            fs.writeFile("firstData.json", str_data, (err) => {
                resolve(str_data);
            });
        },0);
        
    });
    

    const prom2 = new Promise ((resolve, reject) => {
        setTimeout(() => {
            fs.readFile("firstData.json", (err, js_data) => {
                resolve(JSON.parse(js_data))
            })
        },0);
    })


    async function myfun(){
        let get1 = await prom1;
        console.log("waiting for first promise should be done");

        let get2 = await prom2;
        var id_array = []
        var num = 0
        for(var x = 0; x < get2.length; x++){
            for (var y in get2[x]){
                if(y == "id"){
                    var id = parseInt(get2[x][y])
                    id_array.push(id)
                }
                if(y == "name"){
                    console.log(num, get2[x][y] ,id)
                    console.log()
                }   
            }num++
        }
        
        console.log("************************************ARRAY OF ID**************************************")
        console.log()
        console.log(id_array)
        console.log()
        console.log("**************************************COURSE OF INDEX********************************")
        const readlinSync = require("readline-sync")
        const index = parseInt(readlinSync.question("enter the index---"))
        var c = 0
        for (var z = 0; z<get2.length; z++){
            for(var i in get2[z]){
                if(i == "name"){
                    if(index == c){
                        console.log(index, get2[z][i], parseInt(get2[z]["id"]))

                    }
                }
            }c++;
        }
        console.log("************************************PERENT-EXERCISE************************************")
        console.log()
    
        axios.get("http://saral.navgurukul.org/api/courses/" + id_array[index] + "/exercises").then( (get) => {
            var data = JSON.stringify(get.data, null, 4)
            const prom3 = new Promise ((resolve, reject) => {
                    setTimeout(() => {
                        fs.writeFile("course"+index+".json",data, (err) => {
                            resolve("datawrote.....");
                        });
                    },500);
                })
            const prom4 = new Promise ((resolve, reject) => {
                setTimeout(() => {
                    fs.readFile("course"+index+".json", (err, js_data) => {
                        resolve(JSON.parse(js_data))
                    })
                },1000);
            })    
            async function fun1(){
                let wdata = await prom3
                let rdata = await prom4
                var newArrayData = rdata["data"]
                var counting = 1
                var slug_array = []
                for (y in newArrayData){
                    for(z in newArrayData[y]){
                        if(z == "name"){
                            console.log(counting,newArrayData[y][z])
                            counting++;
                        }else if(z == "childExercises"){
                            if(newArrayData[y][z].length >=1){
                                childArray = newArrayData[y][z]
                                for (x in childArray){
                                    var obj = childArray[x]
                                    for (t in obj){
                                        if(t == "name"){
                                            console.log("    ",c,obj[t]);
                                            console.log()
                                        }
                                    }
                                }
                            }
                            else{
                                console.log("   ",newArrayData[y][z])
                            }                 
                        }else if(z == "slug"){
                            slug_array.push(newArrayData[y][z]);
                        }
                    }
                }
                console.log(slug_array)
                slug_index = readlinSync.question("Enter the slug index ----")
                // slug_index = 4
                var slug_id = slug_array[slug_index]
                axios.get("http://saral.navgurukul.org/api/courses/"+id_array[index]+"/exercise/getBySlug?slug="+slug_id).then((Respdata) => {
                    const slugData = JSON.stringify(Respdata.data, null,5)
                    const prom5 = new Promise((res,rej) => {
                        setTimeout(() =>{
                            fs.writeFile("slugfile"+slug_index+".json",slugData,(err) => {
                                res("Done.....")
                            })
                        },500)
                    });
                    const prom6 = new Promise ((resolve, reject) => {
                        setTimeout(() => {
                            fs.readFile("slugfile"+slug_index+".json", (err, js_data) => {
                                resolve(JSON.parse(js_data))
                            })
                        },1000);
                    })  
                    async function slugFun(){
                        let slugD1 = await prom5
                        console.log(slugD1)
                        let slugD2 = await prom6
                        for (s in slugD2){
                            if(s == "content"){
                                console.log(slugD2[s])
                            }
                        }
                    }slugFun()
                
                })
            
            }fun1()
        })
    }myfun()
})





