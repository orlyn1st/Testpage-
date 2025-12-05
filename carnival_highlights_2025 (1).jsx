import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function CarnivalHighlights2025() {
  const [carnivals, setCarnivals] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCarnivals() {
      try {
        // Try fetching from multiple possible URLs for flexibility
        const urls = [
          'https://events.caribbeanairforce.com/data/carnivals2025.json',
          '/data/carnivals2025.json'
        ];

        let data = null;
        for (const url of urls) {
          try {
            const res = await fetch(url, { mode: 'cors', cache: 'no-store' });
            if (res.ok) {
              data = await res.json();
              if (Array.isArray(data)) break;
            }
          } catch (fetchError) {
            console.warn(`Fetch failed for ${url}:`, fetchError);
          }
        }

        // If still no data, use fallback
        if (!data || !Array.isArray(data)) {
          console.warn('Using fallback carnival data.');
          data = [
            {
              eventName: 'Trinidad & Tobago Carnival 2025',
              island: 'Trinidad & Tobago',
              dates: 'March 3–4, 2025',
              referenceUrl: '#',
              images: {
                scenic: '/placeholder-scenic.jpg',
                festive: '/placeholder-festive.jpg'
              }
            },
            {
              eventName: 'Barbados Crop Over Festival 2025',
              island: 'Barbados',
              dates: 'August 2025',
              referenceUrl: '#',
              images: {
                scenic: '/placeholder-scenic.jpg',
                festive: '/placeholder-festive.jpg'
              }
            }
          ];
        }

        setCarnivals(data);
      } catch (err) {
        console.error('Unexpected error loading carnival data:', err);
        setError('Unable to load Carnival Highlights. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    fetchCarnivals();
  }, []);

  const getFlagEmoji = (island) => {
    const flags = {
      'Trinidad & Tobago': '🇹🇹',
      'Barbados': '🇧🇧',
      'Jamaica': '🇯🇲',
      'Grenada': '🇬🇩',
      'Antigua & Barbuda': '🇦🇬',
      'St. Lucia': '🇱🇨',
      'Bahamas': '🇧🇸',
      'Curaçao': '🇨🇼',
      'Puerto Rico': '🇵🇷',
      'Guyana': '🇬🇾'
    };
    return flags[island] || '🏝️';
  };

  return (
    <section className="px-6 py-12 bg-gradient-to-b from-orange-50 to-yellow-50">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-orange-700 mb-2">Carnival Highlights 2025</h2>
        <p className="text-gray-700 italic">
          Experience the rhythm and color of the Caribbean — here are 2025’s biggest carnivals!
        </p>
      </div>

      {loading && (
        <p className="text-center text-gray-500 italic animate-pulse">
          Loading Carnival Highlights...
        </p>
      )}

      {error && !loading && (
        <p className="text-center text-red-500 font-semibold mb-4">{error}</p>
      )}

      {!loading && !error && carnivals.length > 0 && (
        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 max-w-6xl mx-auto">
          {carnivals.map((carnival, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                <div className="relative group">
                  <img
                    src={carnival.images?.scenic || '/placeholder-scenic.jpg'}
                    alt={carnival.eventName}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:opacity-0"
                    onError={(e) => (e.target.src = '/placeholder-scenic.jpg')}
                  />
                  <img
                    src={carnival.images?.festive || '/placeholder-festive.jpg'}
                    alt={`${carnival.eventName} festive view`}
                    className="absolute top-0 left-0 w-full h-48 object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    onError={(e) => (e.target.src = '/placeholder-festive.jpg')}
                  />
                </div>
                <CardContent className="p-4 text-center">
                  <h4 className="font-bold text-lg text-orange-700 mb-1">{carnival.eventName}</h4>
                  <p className="text-sm text-gray-600 mb-1">
                    {getFlagEmoji(carnival.island)} {carnival.island}
                  </p>
                  <p className="text-sm text-gray-500 mb-3">{carnival.dates}</p>
                  <Button
                    onClick={() => window.open(carnival.referenceUrl, '_blank')}
                    className="bg-orange-600 text-white hover:bg-orange-700 rounded-full"
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <div className="text-center mt-10">
        <Button
          onClick={() => window.open('/carnivals', '_blank')}
          className="bg-orange-600 text-white hover:bg-orange-700 rounded-full px-6 py-3 text-lg shadow-md"
        >
          View All Carnivals
        </Button>
      </div>
    </section>
  );
}
