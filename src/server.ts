import 'module-alias/register';
import app from './app';

const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
