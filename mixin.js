/**
 * Author: lexxyungcarter
 * Github: https://github.com/lexxyungcarter
 * Email: lexxyungcarter@gmail.com
 */

const iconsMixin = {
    data() {
        return {
            search: '',
            iconList: window.icons,
            iconCategories: window.iconCategories,
            results: null,
            list: null,
            newIcons: 0,
            version: window.iconVersion,
            preferences: {
                copy: 'icon',
                copyButtons: [
                    {text: 'Copy Icon Only', value: 'icon'},
                    {text: 'Copy Icon Class', value: 'icon-class'},
                    {text: 'Copy Icon HTML', value: 'icon-html'},
                    {text: 'Copy Icon HEX', value: 'icon-hex'},
                    {text: 'Copy camelCase', value: 'icon-camelCase'},
                ],
                toastr: {
                    escapeHtml: true,
                    progressBar: true,
                    closeHtml: '<button><i class="icon-off"></i></button>', // override with suitable icon family
                    positionClass: "toast-bottom-right",
                }
            }
        }
    },

    computed: {
        searching() {
            return this.search && this.search.length > 0
        }
    },

    watch: {
        search(val) {
            if (val) {
                this.performSearch()
            }
        }
    },

    methods: {
        initialise() {
            this.generateList()
            this.generateNewIconsList()
        },

        generateList() {
            this.list = _.map(this.iconList, item => {
                return this.generateIconTemplate(item);
            })
        },

        generateNewIconsList() {
            // override in component
        },

        randomString (length = 5) {
            let text = '';
            const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

            for (let i = 0; i < length; i++) {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }

            return text;
        },

        toggleCopyPreference(val) {
            this.preferences.copy = val
        },

        isButtonActive(val) {
            return val === this.preferences.copy
        },

        performSearch() {
            let data = _.filter(this.iconList, item => {
                return item.name.toLowerCase().indexOf(this.search.toLowerCase()) >= 0;
            })

            if(data.length < 1) {
                this.results = ['<div class="alert alert-warning">No icon found!</d>']
                return ;
            }

            this.results = []

            _.each(data, item => {
                this.results.push({
                    html: this.generateTemplate(item),
                    icon: item.name,
                    hex: item.hex,
                })
            })

        },

        getCategoryIcons(category) {
            let icons = _.filter(this.iconList, item => {
                return item.category == category
            })

            return _.map(icons, item => {
                return this.generateIconTemplate(item)
            })
        },

        getIconClass(icon) {
            // override in component
            return icon;
        },
        
        getIconHtml(icon) {
            // override in component
            return icon;
        },
        
        getIconCamelCase(icon) {
            return icon.replace(/-./g, x=>x.toUpperCase()[1])
        },

        generateTemplate(icon) {
            // override in component
            return icon;
        },

        generateIconTemplate(item) {
            return {
                html: this.generateTemplate(item),
                icon: item.name,
                hex: item.hasOwnProperty('hex') ? item.hex : null,
                category: item.hasOwnProperty('category') ? item.category : null,
                version: item.hasOwnProperty('version') ? item.version : null,
                deprecated: item.hasOwnProperty('deprecated') ? item.deprecated : null,
            }
        },

        copyToClipboard(item) {
            let message

            switch(this.preferences.copy) {
                case 'icon':
                    message = item.icon;
                    break;
                case 'icon-class':
                    message = this.getIconClass(item.icon) 
                    break;
                case 'icon-html':
                    message = this.getIconHtml(item.icon) 
                    break;
                case 'icon-hex':
                    message = item.hex;
                    break;
                case 'icon-camelCase':
                    message = this.getIconCamelCase(item.icon)
                    break;
                default:
                    break;
            }

            let _self = this;
            this.$copyText(message).then(function (e) {
                toastr.success('Icon Copied to Clipboard!', message, _self.preferences.toastr)
            }, function (e) {
                toastr.error('Icon NOT Copied to Clipboard!', message, _self.preferences.toastr)
            })
        },

        copyToClipboardSingle(icon) {
            let item = {
                icon: icon,
                hex: icon,
            }

            this.copyToClipboard(item)
        },

    },

    mounted() {
        this.initialise()
    },

};