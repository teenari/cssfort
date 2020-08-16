import cors from 'cors';
import bodyParser from 'body-parser';
import express from 'express';
import fetch from 'node-fetch';
import fnbr from 'fnbr';
const { Client } = fnbr;
// import deviceAuth from './deviceAuth.json';
import sessionexpress from 'express-session';
const app = express();
let session;
const auth = null;

app.set('trust proxy', 1);
app.use(cors({credentials: true, origin: 'https://teenari.github.io'}));
app.use(bodyParser.json());

function setEvents(client, res) {
    function getParty() {
      const members = [];
      for (const mapValue of client.party.members) {
        let member = mapValue[1];
        members.push({
          ...member,
          meta: gets(member.meta.schema)
        });
      }
      return ({
        ...client.party,
        members,
        meta: gets(client.party.meta.schema)
      });
    }
    client.on('friend:request', async (req) => {
      await req.accept();
    });
      client.on('party:member:joined', async (req) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      if(!res.writableEnded) {
        res.write(`data: ${JSON.stringify({ event: 'refresh:party', party: getParty(), data: req })}\n\n`);
      }
    });
    client.on('party:member:disconnected', async (req) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      if(!res.writableEnded) {
        res.write(`data: ${JSON.stringify({ event: 'refresh:party', party: getParty(), data: req })}\n\n`);
      }
    });
    client.on('friend:message', async (message) => {
      if(!res.writableEnded) {
        res.write(`data: ${JSON.stringify({ event: 'friend:message', data: {
          content: message.content,
          author: {
            id: message.author.id,
            displayName: message.author.displayName
          },
          sentAt: new Date().toISOString()
        }})}\n\n`);
      }
    });
    client.on('party:member:message', async (message) => {
      console.log(message);
      if(!res.writableEnded) {
        res.write(`data: ${JSON.stringify({ event: 'party:message', data: message })}\n\n`);
      }
    });
    client.on('party:member:kicked', async (req) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      if(!res.writableEnded) {
        res.write(`data: ${JSON.stringify({ event: 'refresh:party', party: getParty(), data: req })}\n\n`);
      }
    });
    client.on('party:member:expired', async (req) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      if(!res.writableEnded) {
        res.write(`data: ${JSON.stringify({ event: 'refresh:party', party: getParty(), data: req })}\n\n`);
      }
    });
    client.on('party:member:left', async (req) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      if(!res.writableEnded) {
        res.write(`data: ${JSON.stringify({ event: 'refresh:party', party: getParty(), data: req })}\n\n`);
      }
    });
    client.on('party:member:updated', async (req) => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      if(!res.writableEnded) {
        res.write(`data: ${JSON.stringify({ event: 'refresh:party', party: getParty(), data: req })}\n\n`);
      }
    });
  }

  function gets(value) {
    const data = {};
    for (const key of Object.keys(value)) {
      let input = value[key];
      try {
        JSON.parse(input);
      } catch(error) {
        data[key] = input;
        continue;
      }
      input = gets(JSON.parse(input));
      data[key] = input;
    }
    return data;
}

(async () => {
    app.listen(process.env.PORT || 300, () => console.log(`[Interact] Listening to http://localhost:${process.env.PORT || 300}/`));

    app.get('/api/user', async (req, res) => {
        res.send({
            "authorization": true
        });
    });

    app.get('/api/auth/', async (req, res) => {
        res.send({
            auth: ""
        });
    });

    app.get('/api/account', async (req, res) => {
        if(!session) return res.send({});
        res.send({
          ...session.client.user
        });
    });

    app.post('/api/account', async (req, res) => {
        if(session)
          return res.sendStatus(403);
        const client = new Client({
          auth: {
            deviceAuth: auth
          }
        });
        session = {
          client,
          auth,
          res: null
        };
        
        res.sendStatus(200);
    });

    app.get('/api/account/authorize', async (req, res) => {
        if(!session) return res.sendStatus(401);
    
        const client = session.client;
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.flushHeaders();
        session.res = res;
        client.debug = (data) => {
          if(data.startsWith('XMPP-Client successfully connected ')) {
            res.write(`data: ${JSON.stringify({ completed: true })}\n\n`);
          }
          if(session && session.res) {
            session.res.write(`data: ${JSON.stringify({ message: data, completed: false })}\n\n`);
          }
        }
        setEvents(client, res);
    
        res.once('close', async () => {
          return res.end();
        });

        await client.login();
        res.write(`data: ${JSON.stringify({ completed: true })}\n\n`);
    });

    app.get('/api/account/party', async (req, res) => {
        const client = session.client;
        const members = [];
        if(!client.party.members) return throwError(res, 401, 'You\'re not fully authorized yet!');
        for (const mapValue of client.party.members) {
          let member = mapValue[1];
          members.push({
            ...member,
            meta: gets(member.meta.schema)
          });
        }
        res.send({
          ...client.party,
          members,
          meta: gets(client.party.meta.schema)
        });
      });
    
      app.get('/api/account/friends', async (req, res) => {
        const client = session.client;
        const friends = [];
        for (const friendO of client.friends.toArray()) {
          const friend = friendO[Object.keys(friendO)[0]];
          friends.push({
            displayName: friend.displayName,
            id: friend.id,
            presence: {
              status: friend.presence ? friend.presence.status : null
            }
          });
        }
        res.send(friends);
      });
      
      app.get('/api/account/fn/content', async (req, res) => {
        res.send(await (await fetch('https://fortnitecontent-website-prod07.ol.epicgames.com/content/api/pages/fortnite-game')).json());
      });
    
      app.get('/api/account/time', async (req, res) => {
        res.send({
          minutes: 0,
          seconds: 0
        });
      });
})();