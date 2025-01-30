import { makeStyles } from '@material-ui/core/styles';

export const useGlobalStyles = makeStyles((theme) => ({
  pageContainer: {
    marginTop: '120px !important', // Navbar'dan sonra büyük bir margin
    minHeight: 'calc(100vh - 120px)', // Sayfanın geri kalanını kaplayacak minimum yükseklik
    width: '100%',
    position: 'relative',
    zIndex: 1,
  }
})); 