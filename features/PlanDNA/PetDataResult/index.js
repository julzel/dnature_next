import PetCard from '../PetCard';
import Button from '../../../components/Button';

const PetDataResult = ({ petData, addAnotherPet, onEdit, onDeletePet }) => (
  <div className='plan-result'>
    <h2>¡Genial!</h2>
    <p>
      Verifica la información de {petData.length > 1 ? 'tus mascotas' : 'tu mascota'}.
      Si deseas actualizar algún dato, puedes editar la información. De lo contrario,
      continúa para obtener un plan de acuerdo a su Porción Diaria Recomendada (PDR).
    </p>
    {petData.map((pet) => (
      <PetCard key={pet.id} petInfo={pet} editPet={onEdit} deletePet={onDeletePet} />
    ))}
    <button type='button' onClick={addAnotherPet}>Agregar otra mascota</button>{' '}
    <Button href='/productos/'>Ver productos</Button>
  </div>
);

export default PetDataResult;
