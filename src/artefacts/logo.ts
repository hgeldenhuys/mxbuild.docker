const pkg = require("../../package");
export const logo = (json: boolean) => {
    !json && console.log(`\x1b[37m                    ##    \x1b[34m          .-.   .-..-.  .-.\x1b[37m   .----. .-. .-..-..-.   .----. 
              ## ##          ==     \x1b[34m|  \`.'  | \\ \\/ /\x1b[37m    | {}  }| { } || || |   | 🔧  \\
           ## ##            ===     \x1b[34m| |\\ /| | / /\\ \\\x1b[37m    | {}  }| {_} || || \`--.|     /
    /""""""""""""""""\\___/ ===      \x1b[34m\`-' \` \`-'\`-'  \`-'\x1b[37m   \`----' \`-----'\`-'\`----'\`----'  
🌊🌊{🌊🌊 🌊🌊🌊 🌊🌊🌊 🌊🌊/ ==    Docker Helper Utility v${pkg.version} Copyright ${new Date().getFullYear()}
     \\______ 👁          __/         By Herman Geldenhuys
       \\    \\        __/            
        \\____\\______/
`)
};

export default logo;
