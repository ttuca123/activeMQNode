const stompit = require("stompit");
const express = require("express");
const app = express();

const connectOptions = {
  host: "localhost",
  port: 61613,
  connectHeaders: {
    host: "/",
    login: "admin",
    passcode: "admin",
    "heart-beat": "5000,5000",
  },
};

const conectar = () => {
  stompit.connect(connectOptions, function (error, client) {
    if (error) {
      console.log("connect error " + error);
      return;
    }

    /*  const sendHeaders = {
      destination: "/queue/test",
      "content-type": "text/plain",
    }; */

    /*const frame = client.send(sendHeaders);
    frame.write("hello 123");
    frame.end(); */

    const subscribeHeaders = {
      destination: "/queue/equipamentos",
      ack: "client-individual",
    };

    client.subscribe(subscribeHeaders, function (error, message) {
      if (error) {
        console.log("subscribe error " + error.message);
        return;
      }

      message.readString("utf-8", function (error, body) {
        if (error) {
          console.log("read message error " + error.message);
          return;
        }

        console.log("received message: " + body);

        client.ack(message);

        //client.disconnect();
      });
    });
  });
};

app.listen(3000, function () {
  /*let teste = {
    message: "Minha Primeira Mensagem ActiveMQ 2.0",
  }; */

  // app.post("http://localhost:8161/api/message/TEST?type=queue", teste);

  conectar();

  console.log(`Server is listening on port 3000`);
});
