/**
 * Copyright 2020 Teenari
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

//  class Client {
//     constructor()
//  }

$(document).ready(async () => {
    const user = await (await fetch('https://webfort.herokuapp.com/api/user', {
        credentials: 'include',
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    })).json();
    if(user.authorization !== false) {
        return window.location = 'https://www.webfort.cf/dashboard/';
    }
    const accountsNames = await (await fetch(`http://webfort.herokuapp.com/api/accounts`, {
        credentials: 'include',
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    }).catch((e) => {
        throw e;
    })).json();
    await new Promise((resolve) => setTimeout(resolve, 400));
    $('.loading-W').fadeOut(500);
    await new Promise((resolve) => setTimeout(resolve, 500));
    $('.notice').fadeIn();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    $('.notice-understand').fadeIn();
    await new Promise((resolve) => $('.notice-understand').click(resolve));
    $('.notice-understand').fadeOut(300);
    await new Promise((resolve) => setTimeout(resolve, 300));
    $('.notice-understand').remove();

    const cids = [
        "CID_438_Athena_Commando_M_WinterGhoulEclipse",
        "CID_439_Athena_Commando_F_SkullBriteEclipse",
        "CID_437_Athena_Commando_F_AztecEclipse",
        "CID_159_Athena_Commando_M_GumshoeDark"
    ];
    let displayName;

    for (const account of accountsNames.accounts) {
        const div = document.createElement('div');
        document.getElementsByClassName('loading-content')[0].appendChild(div);
        div.outerHTML = `<div id="${account}" class="account"><div><img src="https://fortnite-api.com/images/cosmetics/br/${cids[cids.length * Math.random() | 0]}/icon.png"></div><div>${account}</div></div>`;
        $(`#${account}`).hover(
            () => {
                $(`#${account}`).animate({borderRadius: 3}, 100);
            },
            () => {
                $(`#${account}`).animate({borderRadius: 11}, 100);
            }
        );
        $(`#${account}`).click(() => {
            displayName = account;
        });
    };
    await new Promise((resolve) => {
        const inv = setInterval(() => {
            if(displayName) {
                resolve();
                clearInterval(inv);
            }
        });
    });
    console.log(displayName)
    
    // login ect..
    // $('.taskbar').fadeIn();
    // $('.actionbar').fadeIn();
});