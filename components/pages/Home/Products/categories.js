import proteins from '../../../../public/icons/icon_prot_pollo_bn.svg' 
import snacks from '../../../../public/icons/icon_acid_bn.svg' 
import dietas from '../../../../public/icons/icon_curc_complete_bn.svg'
import superfoods from '../../../../public/icons/icon_espir_sup_bn.svg'
import thumbnailDiet from '../../../../public/images/category-diet.jpg'
import thumbnailProteins from '../../../../public/images/category-proteins.jpg'
import thumbnailSnacks from '../../../../public/images/category-snack.jpg'
import thumbnailSuplements from '../../../../public/images/category-suplement.jpg'

const Categories = [
    {
        category: 'recetas',
        ribbonTitle: <div>Mezclas</div>,
        style: {
            backgroundColor: '#07bbc7',
            color: '#212121'
        },
        icon: dietas,
        thumbnail: thumbnailDiet,
        productsList: {
            title: 'Recetas completas DNAture',
            text: <div>some text for recetas,</div>,
            items: [
                'Pollo',
                'Pollo y res',
                'Pollo y caballo',
                'Pollo y cordero',
                'Pollo y búfalo',
                'Pollo y ternero',
            ]
        }
    }, {
        category: 'proteinas',
        ribbonTitle: <div>Proteínas</div>,
        style: {
            backgroundColor: '#07bbc7',
            color: '#fefefa'
        },
        icon: proteins,
        thumbnail: thumbnailProteins,
        productsList: {
            text: <div>some text for proteinas,</div>,
            items: []
        }
    }, {
        category: 'proteinas',
        ribbonTitle: <div>Snacks</div>,
        style: {
            backgroundColor: '#07bbc7',
            color: '#212121'
        },
        icon: snacks,
        thumbnail: thumbnailSnacks,
        productsList: {
            text: <div>some text for proteinas,</div>,
            items: []
        }
    }, {
        category: 'superfoods',
        ribbonTitle: <div>Superfoods</div>,
        style: {
            backgroundColor: '#07bbc7',
            color: '#fefefa'
        },
        icon: superfoods,
        thumbnail: thumbnailSuplements,
        productsList: {
            text: <div>some text for superfoods,</div>,
            items: []
        }
    }
]

export default Categories
