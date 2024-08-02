"use strict";
let stdout;
let fg_color = 'white';
let bg_color = 'rgba(0, 0, 0, 0)';
class Command {
    constructor(exec_name, callback, descrption = '') {
        this.exec_name = exec_name;
        this.callback = callback;
        this.descrption = descrption;
    }
    run() {
        this.callback();
        print_prompt();
    }
}
;
function print_out(stream, str, fg = fg_color, bg = bg_color) {
    let node = document.createElement('pre');
    node.style.color = fg;
    node.style.backgroundColor = bg;
    node.textContent = str;
    stream.appendChild(node);
}
function print_ln(stream, str, fg = fg_color, bg = bg_color) {
    let splited_str = str.split('\n');
    for (let sp of splited_str) {
        let node = document.createElement('pre');
        node.style.color = fg;
        node.style.backgroundColor = bg;
        node.textContent = sp;
        stream.appendChild(node);
        stream.appendChild(document.createElement('br'));
    }
}
function print_Pratham() {
    print_ln(stdout, 'Hello, I am \n\
    ######                                           \n\
    #     # #####    ##   ##### #    #   ##   #    # \n\
    #     # #    #  #  #    #   #    #  #  #  ##  ## \n\
    ######  #    # #    #   #   ###### #    # # ## # \n\
    #       #####  ######   #   #    # ###### #    # \n\
    #       #   #  #    #   #   #    # #    # #    # \n\
    #       #    # #    #   #   #    # #    # #    # \n');
}
function print_prompt() {
    print_out(stdout, 'dr460n $ ', 'green');
}
function print_url(stream, href, fg = fg_color, bg = bg_color) {
    let node = document.createElement('a');
    node.style.color = fg;
    node.style.backgroundColor = bg;
    node.textContent = href;
    node.target = '_self';
    node.setAttribute('href', href);
    stream.appendChild(node);
}
function cmd_whoami() {
    print_out(stdout, "Name: ", 'white');
    print_out(stdout, '\t\tDr460nGeek, aka ');
    print_out(stdout, 'Pratham', 'red');
    print_ln(stdout, '');
    print_out(stdout, 'College: ', 'white');
    print_out(stdout, '\tInspiria Knowledge Campus');
    print_ln(stdout, '');
    print_out(stdout, 'About Me: Newbie Developer HTML(somewhat), CSS(somewhat),\n\ JS (somewhat) & Experienced Linux, Git dr460n. \n\ Python newbie. Lastly a student.\t', 'white');
    print_url(stdout, "", 'blue');
    print_ln(stdout, '');
}
function cmd_links() {
    print_out(stdout, 'My External Links: ', 'yellow');
    print_out(stdout, '\nGithub:', 'red');
    print_out(stdout, '\t\n\t');
    print_url(stdout, "https://github.com/dr460ngeek", 'white');
    print_out(stdout, '\nInstagram: (Follow me.)', 'blue');
    print_out(stdout, '\t\n\t');
    print_url(stdout, "https://www.instagram.com/pratham.ag1/", 'white');
    print_ln(stdout, '');
}
function cmd_disc() {
    print_out(stdout, 'disclamier: ', 'grey');
    print_out(stdout, '(No offense to anybody.) I hate people without a technical \n\ background and try to be oversmart infront of me. \n\ Because all I take is just few a seconds to expose them. \t');
}
function cmd_help(shell) {
    print_ln(stdout, 'fake shell (v0.11) all commands:', 'red');
    for (let i = 0; i < shell.bin.length; i++) {
        let cmds = shell.bin[i];
        print_ln(stdout, cmds.exec_name + '\t - ' + cmds.descrption, 'yellow');
    }
}
function select_last(editable_element) {
    let range = document.createRange();
    let select = window.getSelection();
    range.selectNodeContents(editable_element);
    range.collapse(false);
    select.removeAllRanges();
    select.addRange(range);
}
class Shell {
    constructor() {
        this.bin = [];
        this.history = [];
        this.curr_line = 0;
    }
    init(cmds) {
        this.bin[this.bin.length] = cmds;
    }
    previous_cmds() {
        this.curr_line -= 1;
        if (this.curr_line < 0)
            this.curr_line = 0;
        return this.history[this.curr_line];
    }
    next_cmds() {
        this.curr_line += 1;
        if (this.curr_line >= this.history.length) {
            this.curr_line = this.history.length;
            return '';
        }
        else
            return this.history[this.curr_line];
    }
    appen_history(input) {
        let exec_name = input.trim();
        if (exec_name === '')
            return;
        else {
            this.history.push(input);
            this.curr_line = this.history.length;
        }
    }
    exec(input) {
        let exec_name = input.trim();
        if (exec_name === '') {
            print_prompt();
            return;
        }
        if (exec_name === 'init') {
            print_Pratham();
            cmd_help(this);
            print_prompt();
            return;
        }
        if (exec_name === 'help') {
            cmd_help(this);
            print_prompt();
            return;
        }
        // supported commands
        let founded = false;
        for (let cmds of this.bin) {
            if (cmds.exec_name === exec_name) {
                founded = true;
                cmds.run();
                break;
            }
        }
        if (!founded) {
            print_ln(stdout, "dr460n $ command not found: " + exec_name);
            print_prompt();
        }
    }
}
window.onload = () => {
    stdout = document.getElementById('stdout');
    let stdin = document.getElementById('stdin');
    let dr460n = new Shell();
    dr460n.init(new Command('icon', print_Pratham, 'Print my icon.'));
    dr460n.init(new Command('whoami', cmd_whoami, 'Display my personal profile.'));
    dr460n.init(new Command('links', cmd_links, 'Displays all the external links related to me.'));
    dr460n.init(new Command('help', cmd_help, 'Display all commands supported.'));
    dr460n.init(new Command('disc', cmd_disc, 'Displays the disclaimer :).'));
    document.getElementById('terminal').onclick = (e) => {
        stdin.focus();
    };
    stdin.onkeydown = (e) => {
        if (e.keyCode === 13) {
            let content = stdin.textContent;
            e.preventDefault();
            dr460n.appen_history(content);
            print_ln(stdout, ' ' + content);
            dr460n.exec(content);
            stdin.textContent = '';
            stdin.focus();
        }
        else if (e.keyCode === 38) {
            // up
            e.preventDefault();
            stdin.textContent = dr460n.previous_cmds();
            select_last(stdin);
        }
        else if (e.keyCode === 40) {
            // down
            e.preventDefault();
            stdin.textContent = dr460n.next_cmds();
            select_last(stdin);
        }
    };
    select_last(stdin);
    stdin.focus();
    dr460n.exec('init');
};
