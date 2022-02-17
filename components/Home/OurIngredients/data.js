import res from '../../../public/icons/res_icon_prot-01.svg'
import caballo from '../../../public/icons/caballo_icon_prot-01.svg'
import pollo from '../../../public/icons/pollo_icon_prot-01.svg'
import conejo from '../../../public/icons/conejo_icon_prot-01.svg'
import sardinas from '../../../public/icons/sardina_icon_prot-01.svg'
import bufalo from '../../../public/icons/buff_icon_prot-01.svg'
import cordero from '../../../public/icons/corde_icon_prot-01.svg'

import kale from '../../../public/icons/kale_icon_supl-01.svg'
import espinaca from '../../../public/icons/espi_icon_supl-01.svg'
import espirulina from '../../../public/icons/espir_icon_supl-01.svg'
import acidosGrasos from '../../../public/icons/acidgras_icon_supl-01.svg'
import curcuma from '../../../public/icons/curc_icon_supl-01.svg'

const proteins = [
    {
        icon: res,
        label: 'Res'
    },{
        icon: caballo,
        label: 'Caballo'
    },{
        icon: pollo,
        label: 'Pollo'
    },{
        icon: conejo,
        label: 'Conejo'
    },{
        icon: sardinas,
        label: 'Sardinas'
    },{
        icon: bufalo,
        label: 'Bufalo'
    },{
        icon: cordero,
        label: 'Cordero'
    },
];

const suplements = [
    {
        icon: kale,
        label: 'Kale'
    },{
        icon: espinaca,
        label: 'Espinaca'
    },{
        icon: curcuma,
        label: 'Cúrcuma'
    },{
        icon: espirulina,
        label: 'Espirulina'
    },{
        icon: acidosGrasos,
        label: 'Ácidos grasos escenciales'
    },
]

const data = {
    proteins,
    suplements
}

export default data;