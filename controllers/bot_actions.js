import { bot } from "../bot.js";

const addBotActions=async ()=>{
  
  bot.action('check-documents',async (ctx)=>{
    console.log('Bot hear it')
    await ctx.scene.enter('adminApproveDocs');    
  })
}

export {addBotActions};