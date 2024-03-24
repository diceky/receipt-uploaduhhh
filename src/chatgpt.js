import React, { useState } from 'react';
import OpenAI from 'openai';
 
const Chatgpt = async (conversation, prompt, fileLink ) => {

  const openai = new OpenAI({
    apiKey: process.env['REACT_APP_OPENAI_API_KEY'],
    dangerouslyAllowBrowser: true
  });

  let response = '';
  
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: 'Extract the date, item name, price and tax percentage from this receipt, and respond in JSON. It should have the fields date, item, price and taxRate, where date is written as 2024/3/22, item is a string, price is an integer and taxRate is in percentage. Each property should have only one value. Respond with no formatting.' },
            {
              type: "image_url",
              image_url:fileLink,
            },
          ],
        },
      ],
      // tools: [
      //     {
      //       "type":"function",
      //       "function":{
      //         name: "createReceiptObject",
      //         parameters: {
      //             type: "object",
      //             properties: {
      //                 date: {
      //                     type: "string"
      //                 },
      //                 name: {
      //                     type: "string",
      //                 },
      //                 price: {
      //                     type: "integer"
      //                 },
      //                 tax: {
      //                   type: "integer"
      //               }
      //             },
      //             required: ["date", "name", "price", "tax"]
      //         }
      //       }
      //     }
      // ],
      // tool_choice: "auto",
    });
    
    console.log(completion.choices[0]);

    // const toolCall = completion.choices[0].message.tool_calls[0];
    // const json = JSON.parse(toolCall.function.arguments);
    // console.log(json);

    response = completion.choices[0].message.content;

  } catch ( error ) {
    console.error( error );
    response = error;
  }

  return response;
}

export default Chatgpt;