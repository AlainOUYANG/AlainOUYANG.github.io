export type Publication = {
  year: string;
  title: string;
  authors: string;
  venue: string;
  doi: string;
  pdf?: string;
};

export const publications: readonly Publication[] = [
  {
    year: '2023',
    title: 'Magnetic-Field-Based Indoor Positioning Using Temporal Convolutional Networks',
    authors: 'Guanglie Ouyang, Karim Abed-Meraim, Zuokun Ouyang',
    venue: 'Sensors 23(3), 1514',
    doi: 'https://doi.org/10.3390/s23031514',
    pdf: '/files/sensors-23-01514.pdf'
  },
  {
    year: '2022',
    title: 'Are Deep Learning Models Practically Good as Promised? A Strategic Comparison of Deep Learning Models for Time Series Forecasting',
    authors: 'Zuokun Ouyang, Philippe Ravier, Meryem Jabloun',
    venue: '30th European Signal Processing Conference (EUSIPCO)',
    doi: 'https://doi.org/10.23919/EUSIPCO55093.2022.9909926'
  },
  {
    year: '2021',
    title: 'STL Decomposition of Time Series Can Benefit Forecasting Done by Statistical Methods but not by Machine Learning Ones',
    authors: 'Zuokun Ouyang, Philippe Ravier, Meryem Jabloun',
    venue: 'ITISE 2021 · Engineering Proceedings 5(1), 42',
    doi: 'https://doi.org/10.3390/engproc2021005042',
    pdf: '/files/engproc-05-00042-v2.pdf'
  }
] as const;

export const researchFiles = {
  thesis: '/files/PhD_Thesis.pdf',
  cv: '/files/cv.pdf'
} as const;
