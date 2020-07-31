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
let party = null;
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
let items = {
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
    if($('#fnbtitems')) $('#fnbtitems').remove();
    if($('#SaveItem')) $('#SaveItem').remove();
    if($('#BackButton')) $('#BackButton').remove();
    $('#stuff')[0].innerHTML = '';
    $('#itemDescription').html('');
    $('#taskbarDescription').html('');
    $('#itemName').html('Pick your cosmetic type');
    await setItems(items, items, 'stuff', 0, 10, 100, 100);
}

async function showMenu({cosmeticType, type}) {
    if($('#fnbtitems')) $('#fnbtitems').remove();
    $('#itemName').html(cosmeticType);
    $('#taskbarDescription')[0].outerHTML += '<div id="SaveItem" style="background: black;padding: 5px;width: 50px;height: 18px;position: absolute;top: 7px;left: 632px;color: white;font-size: 23px;font-family: t;text-align: center;border-radius: 10px;user-select: none;cursor: pointer;">SAVE</div><div id="BackButton" style="background: black;padding: 5px;width: 50px;height: 18px;position: absolute;top: 7px;left: 567px;color: white;font-size: 23px;font-family: t;text-align: center;border-radius: 10px;user-select: none;cursor: pointer;">BACK</div>'
    $('#itemDescription').html('');
    $('#taskbarDescription').html('');
    $('#stuff')[0].innerHTML = '';
    $('#stuff')[0].outerHTML += '<div id="fnbtitems"></div>';

    let top = 20;

    if(!type) {
        let selectedItem = null;
        $('#taskbarDescription').html('Pick your item!');
        for (const item of items.sort[cosmeticType.toLowerCase()]) {
            const div = document.createElement('div');
            div.id = `ITEM/${item.id}`;
            div.innerHTML = '';
            div.classList.add('item');
            document.getElementById('fnbtitems').appendChild(div);
            let imageLeft = 7;
            for (const image of createImage(item, top, imageLeft, 'relative', 100, 100)) {
                image.style.left = `${imageLeft}px`;
                div.appendChild(image);
                imageLeft = imageLeft - 100;
            }
            div.innerHTML += `<div style="position: relative;left: 135px;top: ${top - 70}px;font-size: 30px;">${item.name}</div>`;
            $(`[id="ITEM/${item.id}"]`).children().unbind('click').click(async () => {
                selectedItem = item;
                for (const e of $(`[src="${settings.colorScheme.faceplate}"]`)) e.src = settings.colorScheme[settings.currentScheme].faceplate;
                div.children[2].src = settings.colorScheme.faceplate;
            });
            // top += 50;
        }
        $('#SaveItem').unbind('click').click(async () => {
            items[cosmeticType.toLowerCase()] = selectedItem;
            $('#BackButton').click();
            changeItem(selectedItem.id, cosmeticType.toLowerCase());
            await refreshParty();
            refreshMembers(party.members);
        });
    }

    if(type) switch(type) {
        case 'variant': {
            let selectedVariants = [];
            $('#itemName').html(`VARIANT`);
            $('#taskbarDescription').html('Pick your variant!');
            for (const item of items[cosmeticType.toLowerCase()].variants) {
                for (const variant of item.options) {
                    const div = document.createElement('div');
                    div.id = `VARIANT/${variant.tag}`;
                    div.classList.add('item');
                    div.innerHTML = '';
                    document.getElementById('fnbtitems').appendChild(div);
                    let imageLeft = 7;
                    for (const image of createImage({ images: { icon: variant.image } }, top, imageLeft, 'relative', 100, 100)) {
                        image.style.left = `${imageLeft}px`;
                        div.appendChild(image);
                        imageLeft = imageLeft - 100;
                    }
                    div.innerHTML += `<div style="position: relative;left: 135px;top: ${top - 70}px;font-size: 30px;">${variant.name}</div>`;
                    $(`[id="VARIANT/${variant.tag}"]`).children().click(async () => {
                        if(div.children[2].src.includes('src/images/schemes/a77ecea5.png')) {
                            div.children[2].src = settings.colorScheme[settings.currentScheme].faceplate;
                            console.log(selectedVariants.filter(e => {
                                console.log(e.channel)
                                console.log(item.channel)
                                console.log(e.variant)
                                console.log(variant.tag)
                                console.log(e.variant === variant.tag && e.channel === item.channel)
                                return e.variant !== variant.tag && e.channel !== item.channel ? true : false;
                            }));
                        }
                        else {
                            div.children[2].src = settings.colorScheme.faceplate;
                            selectedVariants.push({
                                item: items[cosmeticType.toLowerCase()].type.backendValue,
                                channel: item.channel,
                                variant: variant.tag
                            });
                        }
                    });
                }
                top += 150;
            }
            if(items.variants[cosmeticType.toLowerCase()]) for (const variant of items.variants[cosmeticType.toLowerCase()]) {
                selectedVariants.push(variant);
                $(`[id="VARIANT/${variant.variant}"]`).children()[2].src = settings.colorScheme.faceplate;
            }
            $('#SaveItem').unbind('click').click(async () => {
                items.variants[cosmeticType.toLowerCase()] = selectedVariants;
                $('#BackButton').click();
                addVariant(selectedVariants, cosmeticType.toLowerCase());
            });
        } break;
        
        default: {
            console.log('Unknown Type');
        } break;
    }
    $('#fnbtitems')[0].innerHTML += '<textarea id="searchBar" placeholder="Search"></textarea>';

    $('#BackButton').unbind('click').click(hideMenu);
    $('#searchBar').keyup(() => {
        const search = $('#searchBar').val();
        for (const item of $('#fnbtitems').children().children(`div`).filter(function() {
            const text = this.textContent || this.innerText;
            return text.startsWith(search);
        })) {
            item.parentNode.hidden = false;
        }
        for (const item of $('#fnbtitems').children().children(`div`).filter(function() {
            const text = this.textContent || this.innerText;
            return !text.startsWith(search);
        })) {
            item.parentNode.hidden = true;
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
        IMAGE.style.position = 'absolute';
        div.appendChild(IMAGE);
        IMAGE.onclick = callback || function () {
            if($('#fnbtitems')) $('#fnbtitems').remove();
            $('#stuff')[0].innerHTML = `<div id="Item" style="font-size: 50px;background: black;color: white;border-radius: 10px;padding: 5px;margin: 10px;cursor: pointer;">Item</div>${Array.isArray(argumen[0].variants) ? '<div id="Variant" style="font-size: 50px;background: black;color: white;border-radius: 10px;padding: 5px;cursor: pointer;">Variant</div>' : '<div style="font-size: 50px;background: gray;color: white;border-radius: 10px;padding: 5px;cursor: pointer;" disabled>Variants Disabled</div>'}`;
            $('#Item').click(async () => await showMenu({cosmeticType: argumen[0].type.value.toUpperCase()}));
            $('#Variant').click(async () => await showMenu(argumen[0].type.value.toUpperCase(), 'variant'));
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
    const itemss = {
        "outfit": items.cosmetics.outfit[Math.floor(Math.random() * items.cosmetics.outfit.length - 1) + 0],
        "backpack": items.cosmetics.backpack[Math.floor(Math.random() * items.cosmetics.backpack.length - 1) + 0],
        "pickaxe": items.cosmetics.pickaxe[Math.floor(Math.random() * items.cosmetics.pickaxe.length - 1) + 0],
        "banner": items.cosmetics.banner[Math.floor(Math.random() * items.cosmetics.banner.length - 1) + 0]
    }
    items = {
        ...items,
        ...itemss
    }
    for (const item of Object.keys(itemss)) {
        changeItem(itemss[item].id, item);
    }
    return items;
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
    for (const key of Object.keys(items).filter(e => e !== 'conversions' && e !== 'default' && e !== 'variants' && e !== 'cosmetics' && e !== 'sort')) {
        const value = items[key];
        if(!itemss.sort[value.type.value]) itemss.sort[value.type.value] = [];
        itemss.sort[value.type.value].push(value);
        itemss[key] = value;
        await createImageInElement(document.getElementById(id), false, [value, top, left, id, width, height, value.id]);
        left += 50;
        if(width !== 50) left += 50;
    }
    return {top, left, width, height};
}

async function refreshParty() {
    return party = await (await fetch('https://fortnitebtapi.herokuapp.com/api/account/party', {credentials: 'include', headers: {'Access-Control-Allow-Origin': "https://teenari.github.io"}})).json();
}

function refreshMembers(members) {
    document.getElementById('members').innerHTML = '';
    for (const member of members) {
        const fnapiImage = `https://fortnite-api.com/images/cosmetics/br/${member.meta['Default:AthenaCosmeticLoadout_j'].AthenaCosmeticLoadout.characterDef.split('/').pop().split('.').pop().replace(/'/g, '')}/icon.png`;
        const images = createImage({ images: { icon: fnapiImage } }, 0, 0, 'absolute');
        const div = document.createElement('div');
        div.id = `${member.displayName}#${member.id}`;
        div.innerHTML = '';
        div.classList.add('member');
        document.getElementById('members').appendChild(div);
        for (const img of images) {
            img.style.cursor = 'auto';
            switch(true) {
                case img.src.includes(settings.colorScheme[settings.currentScheme].back.replace('.', '')): {
                    img.style.position = 'relative';
                    img.style.left = '1px';
                } break;

                case img.src.includes(fnapiImage): {
                    img.style.left = '1px';
                } break;

                case img.src.includes(settings.colorScheme[settings.currentScheme].faceplate.replace('.', '')): {
                    img.style.left = '1px';
                } break;
            }
            div.appendChild(img);
        }
        div.innerHTML += `<div class="playerName">${member.displayName}</div>`;
    }
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
    source.onmessage = async (data) => {
        if((JSON.parse(data.data)).exit) {
            $(`[style="background-color: black;color: white;position: absolute;font-family: t;text-align: -webkit-center;margin: 0;padding:0;height:100%;width:100%;display: none;justify-content: center;align-items: center;font-size: 100px;user-select: none;"]`).fadeIn().css('display', 'flex');
        }
        if((JSON.parse(data.data)).event) {
            switch(JSON.parse(data.data).event) {

                case 'refresh:party': {
                    await refreshParty();
                    refreshMembers(party.members);
                } break;

            }
        }
    }
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
    $('#CosmeticsButton').click(async () => {
        $('#stuff')[0].innerHTML = '';
        $('#itemDescription').html('');
        $('#taskbarDescription').html('');
        $('#itemName').html('Pick your cosmetic type');
        await setItems(items, items, 'stuff', 0, 10, 100, 100);
    });
    $('#PartyButton').click(async () => {
        $('#stuff')[0].innerHTML = '';
        $('#itemDescription').html('Party information.');
        $('#taskbarDescription').html('');
        $('#itemName').html('PARTY');
    });
    party = await (await fetch('https://fortnitebtapi.herokuapp.com/api/account/party', {credentials: 'include', headers: {'Access-Control-Allow-Origin': "https://teenari.github.io"}})).json();
    refreshMembers(party.members);
    $('#RefreshMembers').click(async () => {
        await refreshParty();
        refreshMembers(party.members);
    });
    setLoadingText('Starting');
    $('#fortnite').fadeOut(300);
    $('.menu-container').css('left', '300vh').show().animate({left: '58.5px'}, 700);
    $('#avatar').css('position', 'absolute').css('left', '-500px').show().animate({left: 10}, 700);
    stopText();
    await new Promise((resolve) => setTimeout(resolve, 300));
    $('#fortnite').css('padding', '0px');
});