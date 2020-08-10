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
    const user = await (await fetch('https://fortnitebtapi.herokuapp.com/api/user', {
        credentials: 'include',
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    })).json();
    $('[class="loader-container"]').remove();
    if(user.authorization !== false) {
        $('#loginwithDiscord').css('left', '34px');
        $('#loginwithDiscord')[0].innerText = 'Continue';
        $('#loginwithDiscord').click(() => {
            window.location = 'https://teenari.github.io/fortnitebt/dashboard';
        });
        $('#data').animate({
            top: '-18px'
        }, 300);
        await new Promise((resolve) => setTimeout(resolve, 350));
        $('#username')[0].innerText = `${user.username}#${user.discriminator}`;
    }

    $('.loginDiscord').fadeIn();
});