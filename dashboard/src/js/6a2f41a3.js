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
    const menu = $('#menu');
    menu.fadeOut(250);
    await new Promise((resolve) => setTimeout(resolve, 250));
    menu[0].innerHTML = '';
    menu[0].hidden = true;
}

async function showMenu(cosmeticType) {
    const menu = $('#menu');
    const id = items[cosmeticType.toLowerCase()].id;
    $(document).unbind('click');
    menu[0].innerHTML = `<div class="cosmetic">${cosmeticType}<br><div style="font-size: 20px; margin: 10px;">Select item by icon<div id="selectItem" class="clickHereButton">Click Here</div></div><div style="font-size: 20px; margin: 0px;">${id}</div><textarea placeholder="Item ID Here" id="cosmeticID"></textarea><div class="clickHereButton" id="SaveID" style="padding: 1px;font-size: 20px;">Save</div><div style="font-size: 20px; margin: 10px;">Select Variant by icon</div><div id="selectVariant" ${!Array.isArray(items[cosmeticType.toLowerCase()].variants) ? 'disabled' : ''} class="clickHereButton" style="font-size: 22px;margin: -2px;">${Array.isArray(items[cosmeticType.toLowerCase()].variants) ? 'Click Here' : 'Item does not have variant option'}</div></div>`;
    menu.fadeIn(250);
    await new Promise((resolve) => setTimeout(resolve, 250));
    $('#selectVariant').click(async () => {
        if(!items[cosmeticType.toLowerCase()].variants) return;
        let selectedVariants = [];
        await new Promise((resolve) => setTimeout(resolve, 1));
        $('#menu').html(`<div class="cosmetic">${settings.currentScheme === 'partyroyale' ? '<div class="textBackground gradient">' : ''}PICK YOUR VARIANT${settings.currentScheme === 'partyroyale' ? '</div>' : '<br>'}<div class="clickHereButton" style="padding: 1px;font-size: 25px;cursor: auto;height: auto;position: relative;top: 10px;"><textarea placeholder="Search Here" style="margin: 0px;width: 300px;height: 13px;resize: none;font-size: 20px;outline: none;border: none;overflow: hidden;font-family: t;position: relative;" id="search"></textarea></div><br><h1 style="border: 1px solid black;margin: 0px;"></h1><div id="cosmetics" style="overflow-y: scroll;width: 340px;height: 300px;"></div><div class="clickHereButton" id="SaveVariant" style="padding: 1px;font-size: 20px;">SAVE</div></div>`);
        $('#search').keyup(() => {
            const searchQuery = $('#search').val();
            for (const element of [...$('#cosmetics').children()].filter(e => !e.children[3].innerText.startsWith(searchQuery))) {
                element.hidden = true;
            }
            for (const element of [...$('#cosmetics').children()].filter(e => e.children[3].innerText.startsWith(searchQuery))) {
                element.hidden = false;
            }
        });
        for (const item of items[cosmeticType.toLowerCase()].variants) {
            for (const variant of item.options) {
                const div = document.createElement("div");
                div.id = `VARIANT/${variant.tag}#${variant.name}`;
                for (const src of [{
                    src: settings.colorScheme[settings.currentScheme].back
                }, {
                    src: variant.image,
                    position: 'relative',
                    right: '100px'
                }, {
                    src: settings.colorScheme[settings.currentScheme].faceplate,
                    position: 'relative',
                    right: '200px'
                }]) {
                    const IMAGE = document.createElement("IMG");
                    if(src.src) IMAGE.width = 100;
                    if(src.src) IMAGE.height = 100;
                    IMAGE.draggable = false;
                    IMAGE.style.cursor = 'pointer';
                    if(src.src) IMAGE.src = src.src;
                    if(src.position) IMAGE.style.position = src.position;
                    if(src.right) IMAGE.style.right = src.right;
                    const element = $('#cosmetics')[0].appendChild(div);
                    $(`[id="VARIANT/${variant.tag}#${variant.name}"]`)[0].appendChild(IMAGE);
                    if(src.src.includes('faceplate.png')) {
                        IMAGE.outerHTML += `<div style="left: 120px;bottom: 80px;position: relative;">${variant.name}</div>`;
                        element.onclick = async (e) => {
                            if(selectedVariants.find((e) => {
                                return e.image === variant.image;
                            })) {
                                selectedVariants = selectedVariants.filter((e) => {
                                    return e.image !== variant.image;
                                });
                                $(`[id="VARIANT/${variant.tag}#${variant.name}"]`).children()[2].src = settings.colorScheme[settings.currentScheme].faceplate;
                            }
                            else {
                                selectedVariants.push({channel: item.channel, tag: variant.tag, name: variant.name, image: variant.image});
                                $(`[id="VARIANT/${variant.tag}#${variant.name}"]`).children()[2].src = settings.colorScheme.faceplate;
                            }
                        }
                    }
                }
            }
        }
        if(items.variants[cosmeticType]) for (const variant of items.variants[cosmeticType]) {
            $(`[id="VARIANT/${variant.tag}#${variant.name}"]`).children()[2].src = settings.colorScheme.faceplate;
            selectedVariants.push(variant);
        }
        $('#SaveVariant').click(async () => {
            if(selectedVariants.length === 0) return;
            if(!items.variants[cosmeticType]) items.variants[cosmeticType] = [];
            items.variants[cosmeticType] = selectedVariants;
            const img = $(`#${id}`)[0].children[0];
            if($(`#${id}`)[0].children[2].outerHTML.includes('opacity: 0.7')) $(`#${id}`)[0].children[2].remove();
            $(`#${id}`)[0].children[1].outerHTML += `<img width="${img.width}" height="${img.height}" draggable="false" src="${selectedVariants[selectedVariants.length - 1].image}" style="cursor: pointer;position: absolute;opacity: 0.7;top: ${img.style.top};left: ${img.style.left};">`;
            const variants = [];
            for (const variant of selectedVariants) {
                variants.push({
                    "item": items[cosmeticType.toLowerCase()].type.backendValue,
                    "channel": variant.channel,
                    "variant": variant.tag
                })
            }
            addVariant(variants, cosmeticType.toLowerCase());
            await hideMenu();
        });
    });
    $('#selectItem').click(async () => {
        let selectedItem = null;
        await new Promise((resolve) => setTimeout(resolve, 1));
        $('#menu').html(`<div class="cosmetic">${settings.currentScheme === 'partyroyale' ? '<div class="textBackground gradient">' : ''}PICK YOUR ${cosmeticType}${settings.currentScheme === 'partyroyale' ? '</div>' : '<br>'}<div class="clickHereButton" style="padding: 1px;font-size: 25px;cursor: auto;height: auto;position: relative;top: 10px;"><textarea placeholder="Search Here" style="margin: 0px;width: 300px;height: 13px;resize: none;font-size: 20px;outline: none;border: none;overflow: hidden;font-family: t;position: relative;" id="search"></textarea></div><br><h1 style="border: 1px solid black;margin: 0px;"></h1><div id="cosmetics" style="overflow-y: scroll;width: 340px;height: 300px;"></div><div class="clickHereButton" id="SaveAvatar" style="padding: 1px;font-size: 20px;">SAVE</div></div>`);
        $('#search').keyup(() => {
            const searchQuery = $('#search').val();
            for (const element of [...$('#cosmetics').children()].filter(e => !e.children[3].innerText.startsWith(searchQuery))) {
                element.hidden = true;
            }
            for (const element of [...$('#cosmetics').children()].filter(e => e.children[3].innerText.startsWith(searchQuery))) {
                element.hidden = false;
            }
        });
        for (const item of items.cosmetics[cosmeticType.toLowerCase()]) {
            const div = document.createElement("div");
            div.id = `ITEM/${item.id}`;
            for (const src of [{
                src: settings.colorScheme[settings.currentScheme].back
            }, {
                src: item.images.icon,
                position: 'relative',
                right: '100px'
            }, {
                src: settings.colorScheme[settings.currentScheme].faceplate,
                position: 'relative',
                right: '200px'
            }]) {
                const IMAGE = document.createElement("IMG");
                if(src.src) IMAGE.width = 100;
                if(src.src) IMAGE.height = 100;
                IMAGE.draggable = false;
                IMAGE.style.cursor = 'pointer';
                if(src.src) IMAGE.src = src.src;
                if(src.position) IMAGE.style.position = src.position;
                if(src.right) IMAGE.style.right = src.right;
                const element = $('#cosmetics')[0].appendChild(div);
                ($(`[id="ITEM/${item.id}"]`)[0].appendChild(IMAGE)).onclick = async (e) => {
                    if(selectedItem === item) return;
                    if(selectedItem && selectedItem !== item) {
                        $(`[src="${settings.colorScheme.faceplate}"]`)[0].src = settings.colorScheme[settings.currentScheme].faceplate;
                    }
                    e.srcElement.src = settings.colorScheme.faceplate;
                    selectedItem = item;
                }
                if(src.src.includes('faceplate.png')) {
                    IMAGE.outerHTML += `<div style="left: 120px;bottom: 80px;position: relative;">${item.name}</div>`;
                    element.onclick = async () => {
                        if(selectedItem === item) return;
                        if(selectedItem && selectedItem !== item) {
                            $(`[src="${settings.colorScheme.faceplate}"]`)[0].src = settings.colorScheme[settings.currentScheme].faceplate;
                        }
                        $(`[id="ITEM/${item.id}"]`).children()[2].src = settings.colorScheme.faceplate;
                        selectedItem = item;
                    }
                }
            }
        }
        $('#SaveAvatar').click(async () => {
           if(!selectedItem) return;
            items[cosmeticType.toLowerCase()] = selectedItem;
            const img = $(`#${id}`)[0].children[0];
            $(`#${id}`)[0].id = selectedItem.id;
            $(`#${selectedItem.id}`)[0].innerHTML = '';
            for (const image of createImage(selectedItem, img.style.top.split('px')[0], img.style.left.split('px')[0], 'absolute', img.width, img.height)) {
                $(`#${selectedItem.id}`).append(image);
                image.onclick = async () => {
                    await showMenu(selectedItem.type.value.toUpperCase());
                }
            }
            changeItem(selectedItem.id, cosmeticType.toLowerCase());
            items.variants[cosmeticType] = [];
            await hideMenu();
        });
    });
    $('#SaveID').click(async () => {
        if($('[id="cosmeticID"]').val().trim() === "" || !items.cosmetics.find(e => e.id === $('[id="cosmeticID"]').val())) return;
        const item = items.cosmetics.find(e => e.id === $('[id="cosmeticID"]').val());
        items[cosmeticType.toLowerCase()] = item;
        const img = $(`#${id}`)[0].children[0];
        $(`#${id}`)[0].id = $('[id="cosmeticID"]').val();
        $(`#${$('[id="cosmeticID"]').val()}`)[0].innerHTML = '';
        for (const image of createImage(item, img.style.top.split('px')[0], img.style.left.split('px')[0], 'absolute', img.width, img.height)) {
            $(`#${$('[id="cosmeticID"]').val()}`).append(image);
            image.onclick = async () => {
                await showMenu(item.type.value.toUpperCase());
            }
        }
        await hideMenu();
    });
    menu.draggable({
        "containment": "window"
    });
    await new Promise((resolve) => setTimeout(resolve, 300));
    $(document).click(async (e) => { 
        if(!$(event.target).closest('#menu').length && $('#menu').is(":visible")) {
            await hideMenu();
            $(document).unbind('click');
        }        
    });
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

async function setItems(items, itemss) {
    let top = 6;
    let left = 6;
    let width = 100;
    let height = 100;
    for (const key of Object.keys(items)) {
        const value = items[key];
        if(!itemss.sort[value.type.value]) itemss.sort[value.type.value] = [];
        itemss.sort[value.type.value].push(value);
        changeItem(value.id, value.type.value);
        itemss[key] = value;
        await createImageInElement(document.getElementById('fnItems'), false, [value, top, left, 'absolute', width, height, value.id]);
        top += 105;
        // width = width - 10;
        // height = height - 10;
    }
    return {top, left, width, height};
}

$(document).ready(async () => {
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
    source.onerror = (e) => {
        return setLoadingText('Error happend, cannot access the error.');
    }

    await new Promise((resolve) => {
        source.onmessage = (data) => {
            const json = JSON.parse(data.data);
            if(json.done) return resolve();
            setLoadingText(json.message);
        }
    });
    source.onmessage = (data) => {
        const json = JSON.parse(data.data);
        console.log(json);
        if(json.exit) return $('#message-container').fadeIn();
    }
    account = await (await fetch('https://fortnitebtapi.herokuapp.com/api/account/', {credentials: 'include', headers: {'Access-Control-Allow-Origin': "https://teenari.github.io"}})).json();
    window.onunload = async () => {
        await fetch('https://fortnitebtapi.herokuapp.com/api/account/session/end', {credentials: 'include', headers: {'Access-Control-Allow-Origin': "https://teenari.github.io"}});
    };
    const timerSettings = {
        seconds: 60,
        minutes: 29
    }
    const timer = setInterval(() => {
        console.log(timerSettings)
        if(timerSettings.seconds === 0 && timerSettings.minutes !== 0) {
            timerSettings.seconds = 60;
            timerSettings.minutes --;
            document.getElementById('30MIN').innerText = `${timerSettings.minutes} minutes and ${timerSettings.seconds} seconds left`;
        }
        if(timerSettings.seconds === 0 && timerSettings.minutes === 0) {
            document.getElementById('30MIN').innerText = `None minutes left`;
            clearInterval(timer);
        }
        if(timerSettings.seconds !== 0) {
            timerSettings.seconds --;
            document.getElementById('30MIN').innerText = `${timerSettings.minutes} minutes and ${timerSettings.seconds} seconds left`;
        }
    }, 1000);
    $('#username')[0].innerText = account.displayName;
    setLoadingText('Loading account');
    setLoadingText('Loading cosmetics');
    const cos = (await (await fetch('https://fortnite-api.com/v2/cosmetics/br')).json()).data;
    items.cosmetics = cos;
    setLoadingText('Categorizing cosmetics');
    categorizeItems(true);
    sortItems();
    setLoadingText('Creating default images');
    const { top, left, width, height } = await setItems(items.default, items);
    await createImageInElement(document.getElementById('fnItems'), false, [{
        images: {
            icon: 'https://gamepedia.cursecdn.com/fortnite_gamepedia/f/f2/ScenarioEmoteIcon.png'
        },
        id: 'Emote'
    }, top + 10, left, 'absolute', width, height, 'Emote'], async (e) => {
        const menu = $('#menu');
        $(document).unbind('click');
        menu[0].innerHTML = `<div class="cosmetic">EMOTE<br><div style="font-size: 20px; margin: 10px;">Select item by icon<div id="selectItem" class="clickHereButton">Click Here</div></div><div style="font-size: 20px; margin: 0px;">Emote ID</div><textarea placeholder="Item ID Here" id="cosmeticID"></textarea><div class="clickHereButton" id="SaveID" style="padding: 1px;font-size: 20px;">Save</div></div>`;
        menu.fadeIn(250);
        menu.draggable({
            "containment": "window"
        });
        await new Promise((resolve) => setTimeout(resolve, 300));
        $(document).click(async (e) => { 
            if(!$(event.target).closest('#menu').length && $('#menu').is(":visible")) {
                await hideMenu();
                $(document).unbind('click');
            }        
        });
        $('#SaveID').click(async () => {
            await hideMenu();
        });
        $('#selectItem').click(async () => {
            let selectedItem = null;
            await new Promise((resolve) => setTimeout(resolve, 1));
            $('#menu').html(`<div class="cosmetic">${settings.currentScheme === 'partyroyale' ? '<div class="textBackground gradient">' : ''}PICK YOUR EMOTE${settings.currentScheme === 'partyroyale' ? '</div>' : '<br>'}<div><div class="clickHereButton" style="padding: 1px;font-size: 25px;cursor: auto;height: auto;position: relative;top: 10px;"><textarea placeholder="Search Here" style="margin: 0px;width: 300px;height: 13px;resize: none;font-size: 20px;outline: none;border: none;overflow: hidden;font-family: t;position: relative;" id="search"></textarea></div><br><h1 style="border: 1px solid black;margin: 0px;"></h1><div id="cosmetics" style="overflow-y: scroll;width: 340px;height: 300px;"></div><div class="clickHereButton" id="SaveAvatar" style="padding: 1px;font-size: 20px;">EMOTE</div></div></div>`);
            $('#search').keyup(() => {
                const searchQuery = $('#search').val();
                for (const element of [...$('#cosmetics').children()].filter(e => !e.children[3].innerText.startsWith(searchQuery))) {
                    element.hidden = true;
                }
                for (const element of [...$('#cosmetics').children()].filter(e => e.children[3].innerText.startsWith(searchQuery))) {
                    element.hidden = false;
                }
            });
            for (const item of items.sort.emote) {
                const div = document.createElement("div");
                div.id = `ITEM/${item.id}`;
                for (const src of [{
                    src: settings.colorScheme[settings.currentScheme].back
                }, {
                    src: item.images.icon,
                    position: 'relative',
                    right: '100px'
                }, {
                    src: settings.colorScheme[settings.currentScheme].faceplate,
                    position: 'relative',
                    right: '200px'
                }]) {
                    const IMAGE = document.createElement("IMG");
                    if(src.src || src.back) IMAGE.width = 100;
                    if(src.src || src.back) IMAGE.height = 100;
                    IMAGE.draggable = false;
                    IMAGE.style.cursor = 'pointer';
                    if(src.src) IMAGE.src = src.src;
                    if(src.position) IMAGE.style.position = src.position;
                    if(src.right) IMAGE.style.right = src.right;
                    const element = $('#cosmetics')[0].appendChild(div);
                    ($(`[id="ITEM/${item.id}"]`)[0].appendChild(IMAGE)).onclick = async (e) => {
                        if(selectedItem === item) return;
                        if(selectedItem && selectedItem !== item) {
                            $(`[src="${settings.colorScheme.faceplate}"]`)[0].src = settings.colorScheme[settings.currentScheme].faceplate;
                        }
                        e.srcElement.src = settings.colorScheme.faceplate;
                        selectedItem = item;
                    }
                    if(src.src.includes('faceplate.png')) {
                        IMAGE.outerHTML += `<div style="left: 120px;bottom: 80px;position: relative;">${item.name}</div>`;
                        element.onclick = async () => {
                            if(selectedItem === item) return;
                            if(selectedItem && selectedItem !== item) {
                                $(`[src="${settings.colorScheme.faceplate}"]`)[0].src = settings.colorScheme[settings.currentScheme].faceplate;
                            }
                            $(`[id="ITEM/${item.id}"]`).children()[2].src = settings.colorScheme.faceplate;
                            selectedItem = item;
                        }
                    }
                }
            }
            $('#SaveAvatar').click(async () => {
                if(!selectedItem) return;
                changeItem(selectedItem.id, 'emote');
                await hideMenu();
            });
        });
    });
    $('#SettingsButton').children().click(async () => {
        const menu = $('#menu');
        $(document).unbind('click');
        menu[0].innerHTML = `<div class="cosmetic">Settings<div id="PartyButton" class="clickHereButton textBackground gradient" style="padding: 3px;font-size: 20px;margin: 10px;">Party</div><div id="AccountSettings" class="clickHereButton" style="padding: 3px;font-size: 20px;margin: 10px;">Account</div><div id="ColorSchemeButton" class="clickHereButton textBackground gradient" style="padding: 3px;font-size: 20px;margin: 10px;">Color Scheme</div></div>`;
        menu[0].style.left = '1093px';
        menu[0].style.top = '14px';
        menu.fadeIn(250);
        menu.draggable({
            "containment": "window"
        });
        $('#PartyButton').click(async () => {
            await new Promise((resolve) => setTimeout(resolve, 1));
            menu[0].innerHTML = '<div class="cosmetic"><div class="textBackground gradient">Party</div><div id="MemberCount" style="font-size: 20px; margin: 10px;">TEMPLATE</div><div id="PrivacyName" style="font-size: 20px; margin: 10px;">TEMPLATE</div><div id="LeaderName" style="font-size: 20px; margin: 10px;">TEMPLATE</div></div>';
        });
        $('#ColorSchemeButton').click(async () => {
            await new Promise((resolve) => setTimeout(resolve, 1));
            menu[0].innerHTML = '';
            for (const colorScheme of Object.keys(settings.colorScheme).filter(e => e !== 'faceplate')) {
                menu[0].innerHTML += `<div style="margin: 10px; cursor: pointer;" id="ColorScheme#${colorScheme}">${colorScheme}</div>`;
            }
            menu[0].innerHTML = `<div class="cosmetic"><div class="textBackground gradient">Pick your Color Scheme</div><div>${menu[0].innerHTML}</div></div>`;
            for (const colorScheme of Object.keys(settings.colorScheme).filter(e => e !== 'faceplate')) {
                $(`[id="ColorScheme#${colorScheme}"]`).click(async () => {
                    changeColorScheme(colorScheme);
                    await hideMenu();
                });
            }
        });
        await new Promise((resolve) => setTimeout(resolve, 250));
        $(document).click(async (e) => { 
            if(!$(event.target).closest('#menu').length && $('#menu').is(":visible")) {
                await hideMenu();
                $(document).unbind('click');
            }        
        });
    });
    setLoadingText('Starting');
    $('#fortnite').fadeOut(300);
    $('.menu-container').css('left', '300vh').show().animate({left: '58.5px'}, 700);
    $('#avatar').css('position', 'absolute').css('left', '-500px').show().animate({left: 10}, 700);
    stopText();
    await new Promise((resolve) => setTimeout(resolve, 300));
    $('#DATA').fadeIn();
    $('#fortnite').css('padding', '0px');
});