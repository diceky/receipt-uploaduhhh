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
        ...conversation,
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
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
    
    //console.log(completion.choices[0]);

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