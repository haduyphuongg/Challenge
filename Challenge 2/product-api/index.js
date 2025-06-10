const express = require('express');
const app = express();
const productRoutes = require('./routes/product');

app.use(express.json());
app.use('/api/product', productRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
