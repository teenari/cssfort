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

class Client {
    constructor ({
        url,
        displayName
    }) {
        this.url = url || 'https://webfort.herokuapp.com';
        this.account = null;
        this.party = null;
        this.friends = null;
        this.hiddenMembers = null;
        this.source = null;
        this.displayName = displayName;
        this.messages = {
            party: null,
            friends: null,
            handler: null
        };
        this.cosmetics = {
            sorted: null,
            variants: null
        };
        this.items = {
            variants: {}
        };
        this.eventHandler = async (data) => {
            const json = JSON.parse(data.data);
            if(json.exit) return $('.message-container').fadeIn();
            if(json.event) {
                const data = json.data;
                const event = json.event;
                switch(event) {
                    case 'refresh:party': {
                        system.party = json.party;
                    } break;
    
                    case 'friend:message': {
                        if(!this.messages.friends[data.author.id]) this.messages.friends[data.author.id] = [];
                        this.messages.friends[data.author.id].push(data);
                        if(this.messages.handler) this.messages.handler(data);
                    } break;
    
                    default: {
                        console.log(data);
                        console.log(`UNKNOWN EVENT ${event}`);
                    } break;
                }
            }
        };
    }

    async authorize() {
        await this.logout();
        await this.createSession(this.displayName);
        this.source = await this.makeSource();
        window.onbeforeunload = this.logout;
        await new Promise((resolve) => {
            this.source.onmessage = (data) => {
                const json = JSON.parse(data.data);
                if(json.completed) return resolve();
            }
        });
        await this.setProperties();
        this.setSourceEvent(this.source);

        return this;
    }

    async logout() {
        this.account = null;
        this.party = null;
        this.friends = null;
        return await this.sendRequest('api/account', {
            method: "DELETE"
        });
    }

    async createSession(displayName) {
        return await this.sendRequest(`api/account?displayName=${displayName}`, {
            method: "POST"
        });
    }

    async changeCosmeticItem(cosmeticType, id) {
        await this.sendRequest(`api/account/party/me/meta?array=["${id}"]&function=set${cosmeticType.toLowerCase().charAt(0).toUpperCase() + cosmeticType.toLowerCase().slice(1)}`, {
            method: "PUT"
        });
        this.items[cosmeticType.toLowerCase()] = this.cosmetics.sorted[cosmeticType.toLowerCase()].find(cosmetic => cosmetic.id === id);
        return this;
    }

    async changeVariants(array, cosmeticType) {
        this.items.variants[cosmeticType] = array;
        await this.sendRequest(`api/account/party/me/meta?array=["${system.items[cosmeticType].id}", ${JSON.stringify(array)}]&function=set${cosmeticType.toLowerCase().charAt(0).toUpperCase() + cosmeticType.toLowerCase().slice(1)}`, {
            method: "PUT"
        });
        return this;
    }

    async makeSource() {
        return new EventSource(`${this.url}/api/account/authorize?auth=${await this.getAuthorizeCode()}`);
    }

    async getAuthorizeCode() {
        return (await (await this.sendRequest('api/auth')).json()).auth;
    }

    async setProperties() {
        this.account = await this.getAccount();
        this.party = await this.getParty();
        this.friends = await this.getFriends();
        this.hiddenMembers = [];
        this.messages = {
            party: [],
            friends: {},
            handler: null
        }
        this.cosmetics.sorted = {};
        this.items.variants = [];
        await this.sortCosmetics();
        await this.setDefaultItems();
        return this;
    }

    async getAccount() {
        const response = await (await this.sendRequest('api/account')).json();
        if(response.authorization === false) return null;
        return response;
    }

    async getParty() {
        return await (await this.sendRequest('api/account/party')).json();
    }

    async getFriends() {
        return await (await this.sendRequest('api/account/friends')).json();
    }

    async getTimeLeft() {
        return await (await this.sendRequest('api/account/time')).json();
    }

    async sendRequest(path, options) {
        return await fetch(`${this.url}/${path}`, {
            credentials: 'include',
            headers: {
                'Access-Control-Allow-Origin': "*"
            },
            ...options
        });
    }

    async sortCosmetics() {
        const data = (await (await fetch('https://fortnite-api.com/v2/cosmetics/br')).json()).data;
        this.cosmetics.all = data;
        for (const value of data) {
            if(!this.cosmetics.sorted[value.type.value]) this.cosmetics.sorted[value.type.value] = [];
            this.cosmetics.sorted[value.type.value].push(value);
        }
        return this;
    }

    async setDefaultItems() {
        const check = (data, main) => {
            const t = main.find(e => e.id === data[(Math.floor(Math.random() * data.length - 1) + 1)]);
            if(!t) return check(data, main);
            return t;
        }
        // if(this.menu.theme.background === 'black&white') {
        //     for (const type of ['outfit', 'backpack', 'pickaxe']) {
        //         await this.changeCosmeticItem(type, check(this.menu.theme.cosmetics[type], this.cosmetics.sorted[type]).id);
        //     }
        // }
        return this;
    }

    async kickPlayer(id) {
        return await this.sendRequest(`api/account/party/kick?id=${id}`);
    }

    async hidePlayer(id) {
        $(`#${id}.icon`).animate({opacity: 0.5}, 300);
        this.hiddenMembers.push({id});
        return await this.sendRequest(`api/account/party/member/hide?id=${id}`);
    }
    
    async showPlayer(id) {
        $(`#${id}.icon`).animate({opacity: 1}, 300);
        this.hiddenMembers = this.hiddenMembers.filter(m => m.id !== id);
        return await this.sendRequest(`api/account/party/member/show?id=${id}`);
    }

    setSourceEvent(source) {
        source.onmessage = this.eventHandler;
        return this;
    }

    get members() {
        if(!this.party) return null;
        return this.party.members;
    }
}

const client = new Client({});

$(document).ready(async () => {
    const user = await (await fetch('https://webfort.herokuapp.com/api/user', {
        credentials: 'include',
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    })).json();
    if(user.authorization === false) {
        window.location = 'https://discord.com/api/oauth2/authorize?client_id=735921855340347412&redirect_uri=https%3A%2F%2Fwebfort.herokuapp.com%2Fapi%2Fauthorize&response_type=code&scope=identify';
    }
    const accountsNames = await (await fetch(`https://webfort.herokuapp.com/api/accounts`, {
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
    $('.loading-content')[0].innerHTML = '<div class="accounts-container"><div>What option do you want to use</div><div class="accounts"></div></div>';

    const cids = [
        "CID_438_Athena_Commando_M_WinterGhoulEclipse",
        "CID_439_Athena_Commando_F_SkullBriteEclipse",
        "CID_437_Athena_Commando_F_AztecEclipse",
        "CID_159_Athena_Commando_M_GumshoeDark"
    ];
    let displayName;

    for (const account of accountsNames.accounts) {
        const div = document.createElement('div');
        document.getElementsByClassName('accounts')[0].appendChild(div);
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
    $('.loading').fadeOut(300);
    await new Promise((resolve) => setTimeout(resolve, 300));
    client.displayName = displayName;
    await client.authorize();
    
    // login ect..
    $('.taskbar').fadeIn();
    $('.actionbar').fadeIn();
});