import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Province } from '@/global.types';
import ProvinceAPI from '@/services/provinceAPI';

interface ProvinceContextType {
  provinces: Province[];
  loading: boolean;
  error: string | null;
  getProvinceBySlug: (slug: string) => Province | undefined;
}

const ProvinceContext = createContext<ProvinceContextType | undefined>(undefined);

export const useProvinces = () => {
  const context = useContext(ProvinceContext);
  if (context === undefined) {
    throw new Error('useProvinces must be used within a ProvinceProvider');
  }
  return context;
};

interface ProvinceProviderProps {
  children: ReactNode;
}

export const ProvinceProvider: React.FC<ProvinceProviderProps> = ({ children }) => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        setLoading(true);
        const data = await ProvinceAPI.getProvinces();
        
        // Transform to match Province type (convert id from string to number)
        const transformedData: Province[] = data.map((province, index) => ({
          id: typeof province.id === 'string' ? parseInt(province.id) || index + 1 : (province.id || index + 1),
          name: province.name,
          slug: province.slug || province.name.toLowerCase().replace(/\s+/g, '-'),
          image: province.image || '/placeholder.svg',
          description: province.description || '',
          point: province.point || { long: 0, lat: 0 },
        }));
        
        setProvinces(transformedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching provinces:', err);
        setError('Không thể tải danh sách tỉnh thành');
        setProvinces([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProvinces();
  }, []);

  const getProvinceBySlug = (slug: string): Province | undefined => {
    return provinces.find((p) => p.slug === slug);
  };

  const value: ProvinceContextType = {
    provinces,
    loading,
    error,
    getProvinceBySlug,
  };

  return <ProvinceContext.Provider value={value}>{children}</ProvinceContext.Provider>;
};

