import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
const lang = localStorage.getItem('lang')

let lng = 'en'

if(lang){
    lng = lang
}

i18n.use(initReactI18next)
    .init({
        lng:lng,
        interpolation:{
            escapeValue:false,
        },
    });

export default i18n;