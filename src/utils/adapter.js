export const adaptPointToClient = (point) => ({
  id: point.id,
  basePrice: point.base_price,
  dateFrom: point.date_from,
  dateTo: point.date_to,
  destination: point.destination,
  isFavorite: point.is_favorite,
  offers: point.offers,
  type: point.type,
});

export const adaptPointToServer = (point) => ({
  id: point.id,
  'base_price': point.basePrice,
  'date_from': point.dateFrom,
  'date_to': point.dateTo,
  destination: point.destination,
  'is_favorite': point.isFavorite,
  offers: point.offers,
  type: point.type,
});

export const adaptDestinationToClient = (destination) => ({
  id: destination.id,
  name: destination.name,
  description: destination.description,
  pictures: destination.pictures ?? [],
});

export const adaptOfferToClient = (offer) => ({
  type: offer.type,
  offers: offer.offers.map((item) => ({
    id: item.id,
    title: item.title,
    price: item.price,
  })),
});
