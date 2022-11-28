import figlet from "figlet";
import chalk from "chalk";
import inquirer from "inquirer";
import chalkAnimation from "chalk-animation";
import { Convert } from "easy-currencies";

const sleep = (ms = 3000) => new Promise((r) => setTimeout(r, ms));

async function Welcome() {
  const title: chalkAnimation.Animation = chalkAnimation.neon(
    figlet.textSync("Exchanger", {
      font: "Big Money-se",
      horizontalLayout: "default",
      verticalLayout: "default",
      width: 100,
      whitespaceBreak: true,
    })
  );
  await sleep();
  title.stop();
}
await Welcome();
let convert = await Convert().from("USD").fetch();
const currencies = Object.keys(convert.rates);

async function main(): Promise<void> {
  const userAns = await inquirer.prompt([
    {
      name: "from",
      type: "list",
      message: chalk.yellowBright("   Select the currency"),
      choices: currencies,
    },
    {
      name: "amnt",
      type: "number",
      message: chalk.yellowBright("   Enter amount here"),
    },
    {
      name: "to",
      type: "list",
      message: chalk.yellowBright("   In which currency you want to convert?"),
      choices: currencies,
    },
  ]);

  if (userAns.amnt != "") {
    if (!isNaN(userAns.amnt)) {
      convert = Convert().from(userAns.from);
      const converted: number = await convert
        .amount(userAns.amnt)
        .to(userAns.to);
      console.log(
        chalk.magenta(`\n---------------------------------------------------`)
      );
      console.log(
        chalk.magenta(
          `\n\t  ${userAns.amnt} ${userAns.from} is equal to ${converted} ${userAns.to}\n`
        )
      );
      console.log(
        chalk.magenta(`---------------------------------------------------`)
      );

      await main();
    } else {
      console.log(
        chalk.redBright(`  >    Invalid input: Amount can not be a string!`)
      );
      await main();
    }
  } else {
    console.log(chalk.redBright(`  >    Enter amount to check`));
    await main();
  }
}

await main();
