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
        color: '#FFAB00',
        icon: dietas,
        thumbnail: thumbnailDiet,
        products: [
            'product 1',
            'product 2',
            'product 3',
            'product 4'
        ]
    }, {
        category: 'proteinas',
        ribbonTitle: <div>Proteínas</div>,
        color: '#D20000',
        icon: proteins,
        thumbnail: thumbnailProteins,
        products: [
            'product 1',
            'product 2',
            'product 3',
            'product 4'
        ]
    }, {
        category: 'proteinas',
        ribbonTitle: <div>Snacks</div>,
        color: '#800085',
        icon: snacks,
        thumbnail: thumbnailSnacks,
        products: [
            'product 1',
            'product 2',
            'product 3',
            'product 4'
        ]
    }, {
        category: 'superfoods',
        ribbonTitle: <div>Superfoods</div>,
        color: '#006D01',
        icon: superfoods,
        thumbnail: thumbnailSuplements,
        products: [
            'product 1',
            'product 2',
            'product 3',
            'product 4'
        ]
    }
]

export default Categories
