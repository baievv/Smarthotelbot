import { bot } from "../bot.js";
import { testFunc } from "../utils/utils.js";

const addBotActions=async ()=>{
  
  bot.action('check-documents',async (ctx)=>{
    console.log('Bot hear it')
    await ctx.scene.enter('adminApproveDocs');    
  })

  bot.hears('on', async(ctx)=>{
    testFunc('batumi','Lock','open');
  });

  bot.hears("off", async (ctx) => {
		testFunc("batumi", "Lock", "closed");
  });
}

export {addBotActions};