import axios from 'axios';

export const OPENAI_API_BASE = 'https://api.near.ai/v1';
export const NEAR_AGENT_ID = 'svntax.near/pm-agent/latest';
export const SIGN_MESSAGE = 'Welcome to NEAR AI';
export const RECIPIENT = 'ai.near';

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
  const { input, auth } = req.body;
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
    const response = await axios.post(
      OPENAI_API_BASE + '/threads/runs',
      {
        "agent_id": NEAR_AGENT_ID,
        "new_message": input,
        "max_iterations": "1"
      },
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