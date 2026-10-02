import { useId } from 'react';
import OptionsMenu from '../../../components/OptionsMenu';
import petContentDictionary from './petContentDictionary';

const PetDataDisplay = ({ petInfo }) => {
  const rows = [
    { key: 'Edad', value: petContentDictionary.age[petInfo.age] },
    { key: 'Etapa', value: petContentDictionary.puppyStage[petInfo.puppyStage] },
    { key: 'Tamaño', value: petContentDictionary.size[petInfo.size] },
    { key: 'Castración', value: petContentDictionary.castrated[petInfo.castrated] },
    { key: 'Contextura', value: petContentDictionary.bodyContexture[petInfo.bodyContexture] },
    { key: 'Actividad diaria', value: petContentDictionary.dailyActivity[petInfo.dailyActivity] },
    { key: 'Peso en kilogramos', value: `${petInfo.weight} kg` },
  ];

  return (
    <dl>
      {rows.map((row) => (
        <div key={row.key}>
          <dt>{row.key}</dt>
          <dd>{row.value}</dd>
        </div>
      ))}
    </dl>
  );
};

const PetCard = ({ petInfo, editPet, deletePet }) => {
  const headingId = useId();
  const { id, name, portionSize } = petInfo;

  return (
    <article className='companion-card' aria-labelledby={headingId}>
      <h3 id={headingId}>{name}</h3>
      <p>PDR: {portionSize} gr</p>
      <OptionsMenu
        ariaLabel={`Opciones para ${name}`}
        deleteItem={() => deletePet(id)}
        editItem={() => editPet(id)}
      />
      <PetDataDisplay petInfo={petInfo} />
    </article>
  );
};

export default PetCard;
