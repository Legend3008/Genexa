
import MainLayout from '@/layouts/MainLayout';
import Map3D from '@/components/Map3D';

const Map = () => {
  return (
    <MainLayout>
      <div className="pt-16">
        <Map3D />
      </div>
    </MainLayout>
  );
};

export default Map;
