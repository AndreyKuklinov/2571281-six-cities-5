import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { RootState, AppDispatch } from '../store';
import {
  fetchOfferById,
  fetchCommentsByOfferId,
  fetchNearbyOffers,
  toggleFavorite
} from '../store/api-actions';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';
import Map from './Map';
import OfferList from './OfferList';
import Header from './Header';

function OfferPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const currentOffer = useSelector((state: RootState) => state.currentOffer);
  const comments = useSelector((state: RootState) => state.comments);
  const nearbyOffers = useSelector((state: RootState) => state.nearbyOffers);
  const authorizationStatus = useSelector((state: RootState) => state.authorizationStatus);

  useEffect(() => {
    async function loadOfferData() {
      if (!id) {
        return;
      }
      try {
        await dispatch(fetchOfferById(id));
        await dispatch(fetchCommentsByOfferId(id));
        await dispatch(fetchNearbyOffers(id));
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          navigate('*');
        }
      }
    }
    loadOfferData();
  }, [id, dispatch, navigate]);

  if (!currentOffer) {
    return <p>Loading offer details...</p>;
  }

  const handleBookmarkClick = () => {
    if (authorizationStatus !== 'AUTH') {
      navigate('/login');
      return;
    }
    dispatch(toggleFavorite(currentOffer.id, currentOffer.isFavorite));
  };

  const nearbyToDisplay = nearbyOffers.slice(0, 3);

  return (
    <div className="page">
      <Header />
      <main className="page__main page__main--offer">
        <section className="offer">
          <div className="offer__gallery-container container">
            <div className="offer__gallery">
              {currentOffer.images?.map((url) => (
                <div key={url} className="offer__image-wrapper">
                  <img className="offer__image" src={url} alt="Offer" />
                </div>
              ))}
            </div>
          </div>
          <div className="offer__container container">
            <div className="offer__wrapper">
              {currentOffer.isPremium && (
                <div className="offer__mark">
                  <span>Premium</span>
                </div>
              )}
              <div className="offer__name-wrapper">
                <h1 className="offer__name">{currentOffer.title}</h1>
                <button
                  className={`offer__bookmark-button button ${
                    currentOffer.isFavorite ? 'offer__bookmark-button--active' : ''
                  }`}
                  type="button"
                  onClick={handleBookmarkClick}
                >
                  <svg className="offer__bookmark-icon" width="31" height="33">
                    <use xlinkHref="#icon-bookmark" />
                  </svg>
                  <span className="visually-hidden">
                    {currentOffer.isFavorite ? 'In bookmarks' : 'To bookmarks'}
                  </span>
                </button>
              </div>
              <div className="offer__rating rating">
                <div className="offer__stars rating__stars">
                  <span style={{ width: `${currentOffer.rating}%` }} />
                  <span className="visually-hidden">Rating</span>
                </div>
                <span className="offer__rating-value rating__value">
                  {(currentOffer.rating / 20).toFixed(1)}
                </span>
              </div>
              <ul className="offer__features">
                <li className="offer__feature offer__feature--entire">{currentOffer.type}</li>
                <li className="offer__feature offer__feature--bedrooms">
                  {currentOffer.bedrooms} Bedrooms
                </li>
                <li className="offer__feature offer__feature--adults">
                  Max {currentOffer.maxAdults} adults
                </li>
              </ul>
              <div className="offer__price">
                <b className="offer__price-value">€{currentOffer.price}</b>
                <span className="offer__price-text">&nbsp;night</span>
              </div>
              <div className="offer__inside">
                <h2 className="offer__inside-title">What&apos;s inside</h2>
                <ul className="offer__inside-list">
                  {currentOffer.goods?.map((good) => (
                    <li key={good} className="offer__inside-item">
                      {good}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="offer__host">
                <h2 className="offer__host-title">Meet the host</h2>
                {currentOffer.host && (
                  <div
                    className={`offer__avatar-wrapper user__avatar-wrapper ${
                      currentOffer.host.isPro ? 'offer__avatar-wrapper--pro' : ''
                    }`}
                  >
                    <img
                      className="offer__avatar user__avatar"
                      src={currentOffer.host.avatarUrl}
                      width="74"
                      height="74"
                      alt="Host avatar"
                    />
                  </div>
                )}
                {currentOffer.host && (
                  <>
                    <span className="offer__user-name">{currentOffer.host.name}</span>
                    <span className="offer__user-status">
                      {currentOffer.host.isPro ? 'Pro' : ''}
                    </span>
                  </>
                )}
                <div className="offer__description">
                  <p className="offer__text">{currentOffer.description}</p>
                </div>
              </div>
              <ReviewList reviews={comments} />
              {authorizationStatus === 'AUTH' ? (
                <ReviewForm />
              ) : (
                <p>Please log in to leave a review.</p>
              )}
            </div>
          </div>
          <section className="offer__map map">
            <Map
              offers={[currentOffer, ...nearbyToDisplay]}
              centerCoordinates={[
                currentOffer.location.latitude,
                currentOffer.location.longitude,
              ]}
              currentOfferId={currentOffer.id}
            />
          </section>
        </section>
        <div className="container">
          <section className="near-places places">
            <h2 className="near-places__title">Other places in the neighbourhood</h2>
            <OfferList offers={nearbyToDisplay} />
          </section>
        </div>
      </main>
    </div>
  );
}

export default OfferPage;
