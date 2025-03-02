import axios from 'axios';

import { OPENAI_API_BASE, NEAR_AGENT_ID, createAuthToken } from "@/utils/openai";

// Format for auth token
/* const bearer = {
  "account_id":"your_account.near",
  "public_key":"ed25519:YOUR_PUBLIC_KEY",
  "signature":"A_REAL_SIGNATURE",
  "callback_url":"https://app.near.ai/",
  "message":"Welcome to NEAR AI Hub!",
  "recipient":"ai.near",
  "nonce":"A_UNIQUE_NONCE_FOR_THIS_SIGNATURE"
} */

export default async function handler(req, res) {
  const { input, auth, threadId } = req.body;
  const authToken = createAuthToken(auth);

  const requestBody = {
    "agent_id": NEAR_AGENT_ID,
    "new_message": input,
    "max_iterations": "1"
  };

  let threadEndpoint = '/threads/runs';
  // TODO: reuse threads?
  /* if(threadId && threadId.length > 0){
    threadEndpoint =  `/threads/${threadId}/runs`;
    requestBody.assistant_id = NEAR_AGENT_ID;
  } */

  try {
    // TODO: Running this code (create thread, message, run and stream) fails on client because of CORS
    // Might need to move this to server side, test if that fixes the issue
    /*const thread = await createThread();
        const message = await addMessage(thread.id, "user", inputValue);
        let run = createRunWithStream(thread.id, NEAR_AGENT_ID);
        console.log(run);*/
     const response = await axios.post(
      OPENAI_API_BASE + threadEndpoint,
      requestBody,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.stringify(authToken)}`,
        },
      }
    );

    if(response.status === 200){
      res.status(200).json({ data: response.data });
    }
    else{
      res.status(response.status).json({ res: response.data });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}