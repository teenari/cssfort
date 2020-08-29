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

$(document).ready(async () => {
    $('#loginwithDiscord').unbind('hover').hover(
        () => $('#loginwithDiscord').stop().animate({backgroundColor:'white', color: 'black'}, 100),
        () => $('#loginwithDiscord').stop().animate({backgroundColor:'black', color: 'white'}, 100)
    );
    const user = await (await fetch('https://webfort.herokuapp.com/api/user', {
        credentials: 'include',
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    })).json();
    await new Promise((resolve) => setTimeout(resolve, 1500));
    $('#Understand').fadeIn();
    await new Promise((resolve) => $('#Understand').click(resolve));
    $('.copyright-container').fadeOut();

    if(user.error) {
        $('[id="error-content"]')[0].innerHTML = `<div>${user.error}</div><div>${user.message}</div>`;
        $('[class="error-container"]').fadeIn();
        $('.copyright-container').fadeOut();
        return;
    }
    $('.copyright-container').fadeOut();
    $('#fortnite')[0].innerHTML = '<div id="items"><div id="avatar"><div id="icon"><img src="https://cdn.discordapp.com/avatars/734848834986967096/1de4e2d6318008d40ca5d8f1549ac6b5.png?size=128" width="200px"></div><div style="justify-content: center;align-items: center;width: 100%;height: 100%;"><div id="loginwithDiscord" style="background-color: rgb(32, 34, 37);color: rgb(255, 255, 255);justify-content: center;position: inherit;align-items: center;" onclick="window.location = `https://discord.com/api/oauth2/authorize?client_id=735921855340347412&amp;redirect_uri=https%3A%2F%2Fwebfort.herokuapp.com%2Fapi%2Fauthorize&amp;response_type=code&amp;scope=identify`" class="loginDiscord">Authorize</div></div></div></div>';
    if(user.authorization !== false) {
        $('#icon').children()[0].src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
        $('#loginwithDiscord').css('left', '71px');
        $('#loginwithDiscord')[0].innerText = 'Continue';
        $('#loginwithDiscord').click(() => {
            window.location = 'https://www.webfort.cf/dashboard/';
        });
        $('#data').animate({
            top: '0px'
        }, 300);
        await new Promise((resolve) => setTimeout(resolve, 350));
    }

    $('#fortnite').fadeIn().css('display', 'flex');
    $('.loginDiscord').fadeIn();
});