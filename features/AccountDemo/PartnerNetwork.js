'use client';

import {
  BadgeCheck,
  Building2,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock3,
  Heart,
  MapPin,
  Search,
  ShieldAlert,
  SlidersHorizontal,
  Sparkles,
  Stethoscope,
  Store,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import Button from '../../components/Button';
import { accountStyles } from '../Account';
import AccountShell from './components/DemoAccountShell';
import { useAccountDemo } from './model/account-demo-context';
import {
  demoPartners,
  partnerProvinces,
  partnerServices,
} from './model/demo-partners';
import networkStyles from './PartnerNetwork.module.scss';

const styles = { ...accountStyles, ...networkStyles };

const partnerTypes = [
  { value: 'all', label: 'Todos' },
  { value: 'veterinary', label: 'Veterinarias' },
  { value: 'mobile', label: 'A domicilio' },
  { value: 'petshop', label: 'Pet shops' },
];

const emptyRequest = (selectedPetId = '') => ({
  petId: selectedPetId || '',
  reason: 'Consulta general',
  contactMethod: 'WhatsApp',
  preferredTime: 'Cualquier horario',
  sharePetProfile: false,
});

const normalizeSearch = (value) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es-CR');

const PartnerNetwork = () => {
  const {
    favoritePartnerIds,
    pets,
    profile,
    selectedPet,
    toggleFavoritePartner,
  } = useAccountDemo();
  const [search, setSearch] = useState('');
  const [partnerType, setPartnerType] = useState('all');
  const [province, setProvince] = useState('all');
  const [service, setService] = useState('all');
  const [onlyBenefits, setOnlyBenefits] = useState(false);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [areMobileFiltersOpen, setAreMobileFiltersOpen] = useState(false);
  const [expandedPartnerId, setExpandedPartnerId] = useState(null);
  const [requestPartnerId, setRequestPartnerId] = useState(null);
  const [request, setRequest] = useState(() => emptyRequest(selectedPet?.id));
  const [requestResult, setRequestResult] = useState(null);

  const filteredPartners = useMemo(() => {
    const query = normalizeSearch(search.trim());

    return demoPartners.filter((partner) => {
      const searchable = normalizeSearch(
        [
          partner.name,
          partner.typeLabel,
          partner.province,
          partner.canton,
          partner.district,
          ...partner.services,
          ...partner.specialties,
        ].join(' ')
      );

      return (
        (!query || searchable.includes(query)) &&
        (partnerType === 'all' || partner.type === partnerType) &&
        (province === 'all' || partner.province === province) &&
        (service === 'all' || partner.services.includes(service)) &&
        (!onlyBenefits || Boolean(partner.benefit)) &&
        (!onlyFavorites || favoritePartnerIds.includes(partner.id))
      );
    });
  }, [favoritePartnerIds, onlyBenefits, onlyFavorites, partnerType, province, search, service]);

  const clearFilters = () => {
    setSearch('');
    setPartnerType('all');
    setProvince('all');
    setService('all');
    setOnlyBenefits(false);
    setOnlyFavorites(false);
    setAreMobileFiltersOpen(false);
  };

  const toggleDetails = (partnerId) => {
    setExpandedPartnerId((current) => (current === partnerId ? null : partnerId));
    if (requestPartnerId !== partnerId) setRequestPartnerId(null);
    setRequestResult(null);
  };

  const openRequest = (partnerId) => {
    setExpandedPartnerId(partnerId);
    setRequestPartnerId(partnerId);
    setRequest(emptyRequest(selectedPet?.id));
    setRequestResult(null);
  };

  const updateRequest = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setRequest((current) => ({ ...current, [field]: value }));
    setRequestResult(null);
  };

  const submitRequest = (event, partner) => {
    event.preventDefault();
    const pet = pets.find((item) => item.id === request.petId);
    const contactNote =
      request.contactMethod === 'Correo' || profile.phone
        ? ''
        : ' En producción te pediríamos un teléfono antes de enviarla.';

    setRequestResult({
      partnerId: partner.id,
      message: `Solicitud demo preparada para ${partner.name}${pet ? ` sobre ${pet.name}` : ''}.${contactNote} No se envió información.`,
    });
  };

  const benefitCount = demoPartners.filter((partner) => partner.benefit).length;
  const advancedFilterCount = [
    province !== 'all',
    service !== 'all',
    onlyBenefits,
    onlyFavorites,
  ].filter(Boolean).length;

  return (
    <AccountShell
      eyebrow='Aliados para su bienestar'
      title='Red Veterinaria'
      description='Encontrá veterinarias, profesionales y pet shops asociados para cuidarles con más confianza y conveniencia.'
    >
      <div className={styles.contentStack}>
        <section className={styles.networkHero}>
          <div>
            <span className={styles.networkHeroIcon} aria-hidden='true'>
              <Stethoscope size={30} />
            </span>
            <p className={styles.eyebrow}>Una red que suma valor</p>
            <h2>Atención, productos y beneficios más cerca de vos.</h2>
            <p>
              Explorá aliados por ubicación y servicios, guardá tus favoritos y
              prepará una solicitud de contacto desde tu cuenta.
            </p>
          </div>
          <div className={styles.networkStats}>
            <div>
              <strong>{demoPartners.length}</strong>
              <span>aliados de ejemplo</span>
            </div>
            <div>
              <strong>{partnerProvinces.length}</strong>
              <span>provincias</span>
            </div>
            <div>
              <strong>{benefitCount}</strong>
              <span>beneficios propuestos</span>
            </div>
          </div>
        </section>

        <aside className={styles.networkDemoNote}>
          <Sparkles aria-hidden='true' size={21} />
          <div>
            <strong>Directorio demostrativo</strong>
            <p>
              Los aliados, horarios, citas, códigos y beneficios son ficticios.
              Sirven para evaluar la experiencia antes de crear acuerdos comerciales.
            </p>
          </div>
        </aside>

        <section className={styles.networkFilters} aria-labelledby='network-search-title'>
          <div className={styles.networkFilterHeading}>
            <div>
              <h2 id='network-search-title'>Encontrá un aliado</h2>
              <p>Buscá por nombre, ubicación o servicio.</p>
            </div>
            {favoritePartnerIds.length ? (
              <span className={styles.selectedBadge}>
                {favoritePartnerIds.length} {favoritePartnerIds.length === 1 ? 'favorito' : 'favoritos'}
              </span>
            ) : null}
          </div>

          <div className={styles.networkSearchField}>
            <Search aria-hidden='true' size={20} />
            <label className={styles.visuallyHidden} htmlFor='partner-search'>
              Buscar aliados
            </label>
            <input
              id='partner-search'
              type='search'
              placeholder='Ejemplo: nutrición, San Pedro o pet shop'
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className={styles.mobileFilterBar}>
            <div className={styles.mobileTypeSelect}>
              <label htmlFor='mobile-partner-type'>Tipo de aliado</label>
              <select
                id='mobile-partner-type'
                value={partnerType}
                onChange={(event) => setPartnerType(event.target.value)}
              >
                {partnerTypes.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
            <button
              type='button'
              className={styles.mobileFiltersButton}
              aria-expanded={areMobileFiltersOpen}
              aria-controls='advanced-partner-filters'
              onClick={() => setAreMobileFiltersOpen((open) => !open)}
            >
              <SlidersHorizontal aria-hidden='true' size={17} />
              <span>Más filtros</span>
              {advancedFilterCount ? (
                <strong aria-label={`${advancedFilterCount} filtros activos`}>
                  {advancedFilterCount}
                </strong>
              ) : null}
              {areMobileFiltersOpen ? (
                <ChevronUp aria-hidden='true' size={16} />
              ) : (
                <ChevronDown aria-hidden='true' size={16} />
              )}
            </button>
          </div>

          <div className={styles.partnerTypeFilters} aria-label='Tipo de aliado'>
            {partnerTypes.map((type) => (
              <button
                key={type.value}
                type='button'
                className={partnerType === type.value ? styles.partnerTypeActive : ''}
                aria-pressed={partnerType === type.value}
                onClick={() => setPartnerType(type.value)}
              >
                {type.label}
              </button>
            ))}
          </div>

          <div
            id='advanced-partner-filters'
            className={`${styles.advancedFilters} ${
              areMobileFiltersOpen ? styles.advancedFiltersOpen : ''
            }`}
          >
            <div className={styles.networkFilterGrid}>
              <div className={styles.field}>
                <label htmlFor='partner-province'>Provincia</label>
                <select
                  id='partner-province'
                  value={province}
                  onChange={(event) => setProvince(event.target.value)}
                >
                  <option value='all'>Todas las provincias</option>
                  {partnerProvinces.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label htmlFor='partner-service'>Servicio</label>
                <select
                  id='partner-service'
                  value={service}
                  onChange={(event) => setService(event.target.value)}
                >
                  <option value='all'>Todos los servicios</option>
                  {partnerServices.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.filterChecks}>
              <label>
                <input
                  type='checkbox'
                  checked={onlyBenefits}
                  onChange={(event) => setOnlyBenefits(event.target.checked)}
                />
                Solo con beneficios
              </label>
              <label>
                <input
                  type='checkbox'
                  checked={onlyFavorites}
                  onChange={(event) => setOnlyFavorites(event.target.checked)}
                />
                Solo mis favoritos
              </label>
              <button type='button' onClick={clearFilters}>Limpiar filtros</button>
            </div>
          </div>
        </section>

        <section aria-labelledby='partner-results-title'>
          <div className={styles.resultsHeader}>
            <div>
              <p className={styles.eyebrow}>Resultados</p>
              <h2 id='partner-results-title'>
                {filteredPartners.length}{' '}
                {filteredPartners.length === 1 ? 'aliado disponible' : 'aliados disponibles'}
              </h2>
            </div>
            {profile.province ? (
              <span>
                <MapPin aria-hidden='true' size={16} />
                Tu dirección: {profile.province}
              </span>
            ) : null}
          </div>

          {filteredPartners.length ? (
            <div className={styles.partnerGrid}>
              {filteredPartners.map((partner) => {
                const isFavorite = favoritePartnerIds.includes(partner.id);
                const isExpanded = expandedPartnerId === partner.id;
                const isRequestOpen = requestPartnerId === partner.id;
                const detailsId = `partner-details-${partner.id}`;

                return (
                  <article className={styles.partnerCard} key={partner.id}>
                    <div className={styles.partnerTopRow}>
                      <span className={styles.partnerMonogram} aria-hidden='true'>
                        {partner.initials}
                      </span>
                      <div className={styles.partnerIdentity}>
                        <span>{partner.typeLabel}</span>
                        <h3>{partner.name}</h3>
                        <small>
                          <BadgeCheck aria-hidden='true' size={15} />
                          Aliado DNAture
                        </small>
                      </div>
                      <button
                        type='button'
                        className={`${styles.favoriteButton} ${isFavorite ? styles.favoriteButtonActive : ''}`}
                        aria-label={isFavorite ? `Quitar ${partner.name} de favoritos` : `Guardar ${partner.name} en favoritos`}
                        aria-pressed={isFavorite}
                        onClick={() => toggleFavoritePartner(partner.id)}
                      >
                        <Heart aria-hidden='true' size={20} fill={isFavorite ? 'currentColor' : 'none'} />
                      </button>
                    </div>

                    <div className={styles.partnerLocation}>
                      <MapPin aria-hidden='true' size={17} />
                      <span>{partner.district}, {partner.canton}, {partner.province}</span>
                    </div>
                    <div className={styles.partnerSchedule}>
                      <Clock3 aria-hidden='true' size={17} />
                      <span>{partner.today}</span>
                    </div>

                    <ul className={styles.serviceTags} aria-label={`Servicios de ${partner.name}`}>
                      {partner.services.slice(0, 4).map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>

                    {partner.benefit ? (
                      <div className={styles.partnerBenefit}>
                        <Sparkles aria-hidden='true' size={18} />
                        <div>
                          <span>Beneficio propuesto</span>
                          <strong>{partner.benefit.title}</strong>
                        </div>
                      </div>
                    ) : null}

                    <div className={styles.partnerActions}>
                      <Button
                        size='small'
                        variant='secondary'
                        onClick={() => openRequest(partner.id)}
                      >
                        Solicitar información
                      </Button>
                      <button
                        type='button'
                        className={styles.detailsButton}
                        aria-expanded={isExpanded}
                        aria-controls={detailsId}
                        onClick={() => toggleDetails(partner.id)}
                      >
                        {isExpanded ? 'Ocultar detalles' : 'Ver detalles'}
                        {isExpanded ? <ChevronUp aria-hidden='true' size={17} /> : <ChevronDown aria-hidden='true' size={17} />}
                      </button>
                    </div>

                    {isExpanded ? (
                      <div id={detailsId} className={styles.partnerDetails}>
                        <p>{partner.about}</p>
                        <dl>
                          <div>
                            <dt>Dirección</dt>
                            <dd>{partner.address}</dd>
                          </div>
                          <div>
                            <dt>Horario</dt>
                            <dd>{partner.schedule}</dd>
                          </div>
                          <div>
                            <dt>Áreas destacadas</dt>
                            <dd>{partner.specialties.join(' · ')}</dd>
                          </div>
                        </dl>
                        <div className={styles.availabilityBlock}>
                          <strong>Opciones ilustrativas</strong>
                          <div>
                            {partner.availability.map((slot) => (
                              <span key={slot}><CalendarClock aria-hidden='true' size={15} />{slot}</span>
                            ))}
                          </div>
                        </div>

                        {partner.benefit ? (
                          <div className={styles.benefitDetails}>
                            <span>Beneficio para miembros</span>
                            <h4>{partner.benefit.title}</h4>
                            <p>{partner.benefit.detail}</p>
                            <code>{partner.benefit.code}</code>
                            <small>{partner.benefit.terms}</small>
                          </div>
                        ) : null}

                        {isRequestOpen ? (
                          <form
                            className={styles.partnerRequestForm}
                            onSubmit={(event) => submitRequest(event, partner)}
                          >
                            <div className={styles.requestFormHeading}>
                              <div>
                                <p className={styles.eyebrow}>Contacto demo</p>
                                <h4>Preparar solicitud</h4>
                              </div>
                              <span>No se enviará</span>
                            </div>
                            <div className={styles.networkFilterGrid}>
                              <div className={styles.field}>
                                <label htmlFor={`request-pet-${partner.id}`}>¿Para quién es?</label>
                                <select
                                  id={`request-pet-${partner.id}`}
                                  value={request.petId}
                                  onChange={updateRequest('petId')}
                                >
                                  <option value=''>Consulta general</option>
                                  {pets.map((pet) => (
                                    <option key={pet.id} value={pet.id}>{pet.name}</option>
                                  ))}
                                </select>
                              </div>
                              <div className={styles.field}>
                                <label htmlFor={`request-reason-${partner.id}`}>Motivo</label>
                                <select
                                  id={`request-reason-${partner.id}`}
                                  value={request.reason}
                                  onChange={updateRequest('reason')}
                                >
                                  <option>Consulta general</option>
                                  <option>Orientación nutricional</option>
                                  <option>Disponibilidad de productos</option>
                                  <option>Retiro de pedido</option>
                                  <option>Otro motivo</option>
                                </select>
                              </div>
                              <div className={styles.field}>
                                <label htmlFor={`request-channel-${partner.id}`}>Contacto preferido</label>
                                <select
                                  id={`request-channel-${partner.id}`}
                                  value={request.contactMethod}
                                  onChange={updateRequest('contactMethod')}
                                >
                                  <option>WhatsApp</option>
                                  <option>Llamada</option>
                                  <option>Correo</option>
                                </select>
                              </div>
                              <div className={styles.field}>
                                <label htmlFor={`request-time-${partner.id}`}>Horario preferido</label>
                                <select
                                  id={`request-time-${partner.id}`}
                                  value={request.preferredTime}
                                  onChange={updateRequest('preferredTime')}
                                >
                                  <option>Cualquier horario</option>
                                  <option>Mañana</option>
                                  <option>Tarde</option>
                                </select>
                              </div>
                            </div>
                            <label className={styles.shareProfileCheck}>
                              <input
                                type='checkbox'
                                checked={request.sharePetProfile}
                                disabled={!request.petId}
                                onChange={updateRequest('sharePetProfile')}
                              />
                              <span>
                                <strong>Compartir el perfil básico de la mascota</strong>
                                <small>
                                  Solo peso, etapa y actividad. En producción siempre requeriría tu autorización.
                                </small>
                              </span>
                            </label>
                            <div className={styles.requestActions}>
                              <Button type='submit' size='small'>Preparar solicitud demo</Button>
                              <Button
                                size='small'
                                variant='tertiary'
                                onClick={() => setRequestPartnerId(null)}
                              >
                                Cancelar
                              </Button>
                            </div>
                            {requestResult?.partnerId === partner.id ? (
                              <div className={styles.requestSuccess} role='status'>
                                <CheckCircle2 aria-hidden='true' size={20} />
                                <p>{requestResult.message}</p>
                              </div>
                            ) : null}
                          </form>
                        ) : null}
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <Search aria-hidden='true' size={38} />
              <h3>No encontramos aliados con esos filtros</h3>
              <p>Probá otra ubicación o servicio, o volvé a ver toda la red.</p>
              <Button onClick={clearFilters}>Limpiar filtros</Button>
            </div>
          )}
        </section>

        <aside className={styles.networkSafety}>
          <ShieldAlert aria-hidden='true' size={25} />
          <div>
            <h2>Para atención urgente</h2>
            <p>
              Esta red funciona como directorio y canal de contacto; no es un servicio de emergencias.
              Ante una urgencia, contactá directamente un centro veterinario disponible.
            </p>
          </div>
        </aside>

        <section className={styles.card} aria-labelledby='network-value-title'>
          <div className={styles.cardHeader}>
            <div>
              <p className={styles.eyebrow}>Más valor en cada etapa</p>
              <h2 id='network-value-title'>Una experiencia conectada</h2>
              <p>La red puede unir el cuidado profesional con compras y beneficios útiles.</p>
            </div>
          </div>
          <div className={styles.networkValueGrid}>
            <article>
              <Stethoscope aria-hidden='true' size={23} />
              <h3>Encontrá apoyo</h3>
              <p>Filtrá opciones por servicios, ubicación y tipo de atención.</p>
            </article>
            <article>
              <Heart aria-hidden='true' size={23} />
              <h3>Guardá confianza</h3>
              <p>Mantené a mano los aliados que mejor se adapten a tu familia.</p>
            </article>
            <article>
              <Building2 aria-hidden='true' size={23} />
              <h3>Conectá servicios</h3>
              <p>Prepará solicitudes sin compartir datos de tu mascota automáticamente.</p>
            </article>
            <article>
              <Store aria-hidden='true' size={23} />
              <h3>Aprovechá beneficios</h3>
              <p>Descubrí promociones o puntos de retiro cuando exista un acuerdo vigente.</p>
            </article>
          </div>
        </section>

        <p className={styles.networkDisclaimer}>
          “Aliado DNAture” identificaría una relación comercial activa; no constituye una garantía
          sobre diagnósticos, tratamientos ni resultados clínicos. La información real requerirá
          verificación periódica antes de publicarse.
        </p>
      </div>
    </AccountShell>
  );
};

export default PartnerNetwork;
