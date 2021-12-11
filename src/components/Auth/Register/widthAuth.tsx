import { auth } from '@/intergations/firebase';

const Index = (BaseComponent: any) => {
  function App() {
    if (!auth.currentUser) {
      window.location.href = '/';

      return;
    }

    return BaseComponent;
  }

  return App;
};

export default Index;
