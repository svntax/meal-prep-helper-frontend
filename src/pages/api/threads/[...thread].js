import axios from 'axios';

import { OPENAI_API_BASE, SIGN_MESSAGE, RECIPIENT } from "../../../utils/openai";

export default async function handler(req, res) {
  const { thread } = req.query;
  const { auth } = req.body;
  const authToken = {
    "account_id": auth.accountId,
    "signature": auth.signature,
    "public_key": auth.publicKey,
    "callback_url": auth.callbackUrl,
    "nonce": auth.nonce,
    "message": SIGN_MESSAGE,
    "recipient": RECIPIENT,
    "on_behalf_of": null
  };

  try {
    const response = await axios.get(
      OPENAI_API_BASE + `/threads/${thread[0]}/messages`,
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