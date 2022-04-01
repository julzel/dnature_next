import balance from '../../../../public/home-welcome/our-diet-balance.svg'
import ingredientes from '../../../../public/home-welcome/our-diet-meat.svg'
import recetas from '../../../../public/home-welcome/our-diet-mix.svg'

const items = [
    {
        icon: recetas,
        title: 'Natural',
        text: 'Sin preservantes, colorantes, ni estimulantes olfativos. Los productos de DNAture son 100% naturales y la opción más saludable para tu perro'
    },
    {
        icon: balance,
        smallIcon: true,
        title: 'Balanceada',
        text: 'Cumple con todos los requerimientos nutricionales de tu mascota, con el balance ideal de ingredientes para su máximo aprovechamiento'
    },
    {
        icon: ingredientes,
        title: 'Cruda',
        text: 'Al darle una dieta cruda a tu perro, te aseguras de que obtenga el mayor beneficio posible de los nutrientes que consume'
    },
]

export default items