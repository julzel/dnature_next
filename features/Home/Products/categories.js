// import proteins from '../../../../public/icons/icon_prot_pollo_bn.svg'
// import snacks from '../../../../public/icons/icon_acid_bn.svg'
// import dietas from '../../../../public/icons/icon_curc_complete_bn.svg'
// import superfoods from '../../../../public/icons/icon_espir_sup_bn.svg'
import thumbnailDiet from '../../../../public/images/category-diet.jpg'
import thumbnailProteins from '../../../../public/images/category-proteins.jpg'
import thumbnailSnacks from '../../../../public/images/category-snack.jpg'
import thumbnailSuplements from '../../../../public/images/category-suplement.jpg'
import productsDiet from '../../../../public/images/products-diet.jpg'
import productsProteins from '../../../../public/images/products-proteins.jpg'
import productsSnacks from '../../../../public/images/products-snacks.jpg'
import productsSuper from '../../../../public/images/products-super.jpg'

const superfoods = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
const snacks = [{}, {}, {}, {}, {}, {}, {}]
const recetas = [{}, {}, {}, {}, {}, {}]
const proteinas = [{}, {}]

const Categories = [
    {
        category: 'recetas',
        label: 'Mezclas',
        style: {
            backgroundColor: '#07bbc7'
        },
        thumbnail: thumbnailDiet,
        productsList: {
            title: 'Recetas completas DNAture',
            text: <div>
                Diseñadas para suplir las necesidades nutricionales
                generales de tu mascota y asegurar una absorción
                adecuada y el desempeño óptimo de cada nutriente.
            </div>,
            items: [
                'Pollo',
                'Pollo y res',
                'Pollo y caballo',
                'Pollo y cordero',
                'Pollo y búfalo',
                'Pollo y ternero',
            ],
            price: '₡3500 1kg',
            img: productsDiet
        }
    }, {
        category: 'proteinas',
        label: 'Proteínas',
        style: {
            backgroundColor: '#07bbc7'
        },
        thumbnail: thumbnailProteins,
        productsList: {
            title: 'Proteínas',
            text: <div>
                Ya sea que desees complementar la dieta actual de tu mascota
                con ingredientes de gran calidad, o bien armarle tus propios
                platillos para satisfacer sus necesidades específicas, te
                ofrecemos variedad de proteínas.
            </div>,
            items: [
                'Carne de caballo en trocitos',
                'Carne de res triturada'
            ],
            price: '₡3000 1kg',
            img: productsProteins
        }
    }, {
        category: 'snacks',
        label: 'Snacks',
        style: {
            backgroundColor: '#07bbc7'
        },
        thumbnail: thumbnailSnacks,
        productsList: {
            title: 'Snacks naturales',
            text: <div>
                Para que consientas a tu mascota mientras le
                mantienes saludable.
            </div>,
            items: [
                'Sardinas (paquete de 3 unidades)',
                'Cabezas de trucha',
                'Testículos de toro',
                'Orejas y patas de conejo',
                'Pack de huesos',
                'Tripa verde',
                'Sesos'
            ],
            price: '₡1000 1 paquete',
            img: productsSnacks
        }
    }, {
        category: 'superfoods',
        label: 'Superfoods',
        style: {
            backgroundColor: '#07bbc7'
        },
        thumbnail: thumbnailSuplements,
        productsList: {
            title: 'Super Foods',
            text: <div>
                En DNAture entendemos que tus mascotas podrían terner
                necesidades específicas, que requieren una ayuda adicional
                en su alimentación. Te ofrecemos:
            </div>,
            items: [
                'Levadura de cerveza',
                'Levadura nutricional',
                'Polen',
                'Golden Paste',
                'Mejillón verder',
                'Barf buffet',
                'Multivitamínico',
                'Vitamina E',
                '4 en 1',
                'Malted kelp'
            ],
            price: 'Consulta',
            img: productsSuper
        }
    }
]

export default Categories
