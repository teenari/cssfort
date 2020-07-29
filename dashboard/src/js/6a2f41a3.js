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

let LoadingText = '';
let account = null;
let stream;
const settings = {
    "colorScheme": {
        "black": {
            "back": './src/images/schemes/black/back.png',
            "faceplate": './src/images/schemes/black/faceplate.png'
        },
        "partyroyale": {
            "back": './src/images/schemes/partyroyale/back.png',
            "faceplate": './src/images/schemes/partyroyale/faceplate.png'
        },
        "blue": {
            "back": './src/images/schemes/black/back.png',
            "faceplate": './src/images/schemes/black/faceplate.png'
        },
        "faceplate": './src/images/schemes/a77ecea5.png'
    },
    "currentScheme": 'partyroyale',
    "boxSizing": 'same-size'
}
const items = {
    "outfit": null,
    "backpack": null,
    "pickaxe": null,
    "banner": null,
    "conversions": {},
    "default": {},
    "variants": {},
    "cosmetics": {},
    "sort": {}
}

function changeColorScheme(scheme) {
    Cookies.set('colorScheme', scheme);
    settings.currentScheme = scheme;
    if(settings.currentScheme === 'black') {
        $('html').css('background', 'black');
        $('html').removeClass('backgroundImage gradient blueGradient');
    }
    if(settings.currentScheme === 'partyroyale') {
        $('html').css('background', '');
        $('html').removeClass('backgroundImage gradient blueGradient');
        $('html').addClass('backgroundImage gradient');
    }
    if(settings.currentScheme === 'blue') {
        $('html').css('background', '');
        $('html').removeClass('backgroundImage gradient blueGradient');
        $('html').addClass('blueGradient gradient');
    }
    for (const item of $('img[src*="images/schemes"]')) {
        if(item.src.includes('faceplate.png')) item.src = settings.colorScheme[settings.currentScheme].faceplate;
        if(item.src.includes('back.png')) item.src = settings.colorScheme[settings.currentScheme].back;
    }
}

async function hideMenu() {
}

async function showMenu(cosmeticType) {
}

function setLoadingText(text) {
    LoadingText = text;
    let dots = 0;
    const inv = setInterval(() => {
        if(LoadingText !== text) clearInterval(inv);
        dots += 1;
        if(dots === 4) dots = 0;
        $('#status').html(text + '.'.repeat(dots));
    }, 500);
}

function stopText() {
    LoadingText = ' '.repeat(1000);
}

function createImage(item, top, left, position, width=100, height=100, right=null, id=null) {
    const IMAGES = [];

    for (const src of [settings.colorScheme[settings.currentScheme].back, item.images.icon, settings.colorScheme[settings.currentScheme].faceplate]) {
        const IMAGE = document.createElement("IMG");
        IMAGE.width = width;
        IMAGE.height = height;
        IMAGE.draggable = false;
        IMAGE.style.cursor = 'pointer';
        IMAGE.src = src;
        if(position) IMAGE.style.position = position;
        if(id) IMAGE.id = item.id;
        if(top) IMAGE.style.top = `${top}px`;
        if(left) IMAGE.style.left = `${left}px`;
        if(right) IMAGE.style.left = `${right}px`;
        IMAGES.push(IMAGE);
    }

    return IMAGES;
}

async function createImageInElement(element, hidden, argumen, callback) {
    const html = createImage(...argumen);
    const div = document.createElement('div');
    div.id = argumen[0].id;
    div.hidden = hidden;
    div.innerHTML = '';
    element.appendChild(div);
    for (const IMAGE of html) {
        IMAGE.style.position = 'absolute';
        div.appendChild(IMAGE);
        IMAGE.onclick = callback || async function() {
            await showMenu(argumen[0].type.value.toUpperCase());
        }
    }
}

function changeItem(id, cosmeticType) {
    if(cosmeticType.toLowerCase() === 'banner') return;
    fetch(`https://fortnitebtapi.herokuapp.com/api/account/party/item?array=["${id}"]&function=set${cosmeticType.toLowerCase().charAt(0).toUpperCase() + cosmeticType.toLowerCase().slice(1)}`, {credentials: 'include', method: "PUT", headers: {'Access-Control-Allow-Origin': "https://teenari.github.io"}});
}

function addVariant(array, cosmeticType) {
    fetch(`https://fortnitebtapi.herokuapp.com/api/account/party/item?array=["${items[cosmeticType].id}", ${JSON.stringify(array)}]&function=set${cosmeticType.toLowerCase().charAt(0).toUpperCase() + cosmeticType.toLowerCase().slice(1)}`, {
        credentials: 'include',
        method: "PUT",
        headers: {
            'Access-Control-Allow-Origin': "https://teenari.github.io"
        }
    });
}

function setDefaultItems() {
    items.default = {
        "outfit": items.cosmetics.outfit[Math.floor(Math.random() * items.cosmetics.outfit.length - 1) + 0],
        "backpack": items.cosmetics.backpack[Math.floor(Math.random() * items.cosmetics.backpack.length - 1) + 0],
        "pickaxe": items.cosmetics.pickaxe[Math.floor(Math.random() * items.cosmetics.pickaxe.length - 1) + 0],
        "banner": items.cosmetics.banner[Math.floor(Math.random() * items.cosmetics.banner.length - 1) + 0]
    }
    return items.default;
}

function sortItems() {
    for (const value of items.cosmetics) {
        if(!items.sort[value.type.value]) items.sort[value.type.value] = [];
        items.sort[value.type.value].push(value);
    }
    return items.cosmetics;
}

function categorizeItems(setDefaultItem) {
    for (const item of items.cosmetics) {
        items.conversions[item.type.value] = item.path.split('/Cosmetics/')[1] ? item.path.split('/Cosmetics/')[1].split('/')[0] : null;
        if(items.cosmetics[item.type.value]) continue;
        items.cosmetics[item.type.value] = items.cosmetics.filter(e => e.type.value === item.type.value);
    }
    if(setDefaultItem) {
        setDefaultItems();
    }
    return items.cosmetics;
}

async function setItems(items, itemss, id, top=0, left=10, width=50, height=50) {
    for (const key of Object.keys(items)) {
        const value = items[key];
        if(!itemss.sort[value.type.value]) itemss.sort[value.type.value] = [];
        itemss.sort[value.type.value].push(value);
        changeItem(value.id, value.type.value);
        itemss[key] = value;
        await createImageInElement(document.getElementById(id), false, [value, top, left, id, width, height, value.id]);
        left += 50;
        if(width !== 50) left += 50;
    }
    return {top, left, width, height};
}

$(document).ready(async () => {
    setLoadingText('Loading account');
    const user = await (await fetch('https://fortnitebtapi.herokuapp.com/api/user', {
        credentials: 'include',
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    })).json();
    if(user.authorization === false) {
        return window.location = 'https://discord.com/api/oauth2/authorize?client_id=735921855340347412&redirect_uri=https%3A%2F%2Ffortnitebtapi.herokuapp.com%2Fapi%2Fauthorize&response_type=code&scope=identify%20guilds';
    }
    if(!user.inServer) {
        return window.location = 'https://discord.gg/xkURTCz';
    }
    if(Cookies.get('colorScheme')) changeColorScheme(Cookies.get('colorScheme'));
    else {
        Cookies.set('colorScheme', 'black');
        changeColorScheme('black');
    }

    try {
        await fetch('https://fortnitebtapi.herokuapp.com/api/account/session/', {credentials: 'include', headers: {'Access-Control-Allow-Origin': "https://teenari.github.io"}});
    } catch(error) {
        return setLoadingText('ok');
    }
    const source = new EventSource(`https://fortnitebtapi.herokuapp.com/api/account/session/start?auth=${(await (await fetch('https://fortnitebtapi.herokuapp.com/api/auth', {credentials: 'include', headers: {'Access-Control-Allow-Origin': "https://teenari.github.io"}})).json()).auth}`);
    source.onerror = () => {
        return setLoadingText('Error happend, cannot access the error.');
    }

    await new Promise((resolve) => {
        source.onmessage = (data) => {
            const json = JSON.parse(data.data);
            if(json.done) return resolve();
            setLoadingText(json.message);
        }
    });
    account = await (await fetch('https://fortnitebtapi.herokuapp.com/api/account/', {credentials: 'include', headers: {'Access-Control-Allow-Origin': "https://teenari.github.io"}})).json();
    window.onbeforeunload = async () => {
        await fetch('https://fortnitebtapi.herokuapp.com/api/account/session/end', {credentials: 'include', headers: {'Access-Control-Allow-Origin': "https://teenari.github.io"}});
    };
    $('#username')[0].innerText = account.displayName;
    setLoadingText('Loading cosmetics');
    const cos = (await (await fetch('https://fortnite-api.com/v2/cosmetics/br')).json()).data;
    items.cosmetics = cos;
    setLoadingText('Categorizing cosmetics');
    categorizeItems(true);
    sortItems();
    setLoadingText('Creating default images');
    await setItems(items.default, items, 'buttons');
    await setItems(items.default, items, 'stuff', 0, 10, 100, 100);
    setLoadingText('Starting');
    $('#fortnite').fadeOut(300);
    $('.menu-container').css('left', '300vh').show().animate({left: '58.5px'}, 700);
    $('#avatar').css('position', 'absolute').css('left', '-500px').show().animate({left: 10}, 700);
    stopText();
    await new Promise((resolve) => setTimeout(resolve, 300));
    $('#fortnite').css('padding', '0px');
});