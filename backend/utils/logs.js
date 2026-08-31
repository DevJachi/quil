//import pq
//Write sending to db logic
let client;
let logs = []

export const openConnection = (req, res) => {
    res.setHeader("Content-Type", "text/event-stream")
    res.setHeader("Cache-Control", "no-cache")
    res.setHeader("Connection", "keep-alive")
    res.flushHeaders()

    client = res
    client.write(`${logs}\n\n`)
}

export const broadcast = (log) => {
    console.log("Broadcast:", log)
    console.log("Client exists:", !!client)  
    //Check how the client is and why files arent writing 

     if (!client) return
  
    client.write(`data: ${log}\n\n`)
    logs.push((prev) => [...prev, log])

}

//Ask kiro tomorrow abou it