import { unstable_setRequestLocale } from 'next-intl/server';

import Title from '@/components/typography/Title';
import { Locale } from '@/config/i18n';
import ArticleFormProvider from '@/containers/articles/form/ArticleFormProvider';

type Props = {
  params: {
    locale: Locale;
  };
};

const AddArticlePage = ({ params: { locale } }: Props) => {
  unstable_setRequestLocale(locale);

  return (
    <>
      <div>
        <Title>Add articles</Title>
      </div>
      <div>
        <ArticleFormProvider />
      </div>
    </>
  );
};

export default AddArticlePage;
