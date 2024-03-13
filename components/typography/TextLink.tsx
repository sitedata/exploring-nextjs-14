import React, { ReactNode } from 'react';

import Image from 'next/image';
import Link, { type LinkProps } from 'next/link';
import Balancer from 'react-wrap-balancer';

import { Link as TranslatedLink } from '@/config/navigation';
import { cn } from '@/utils/app.utils';

import Text from './Text';

export type TextLinkProps = LinkProps & {
  isExternal?: boolean;
  children?: ReactNode;
  alt?: string;
  className?: string;
  href?: any;
  translate?: boolean;
  underline?: boolean;
};

const TextLink = ({
  children,
  alt,
  shallow,
  replace,
  scroll,
  prefetch,
  className,
  isExternal,
  href,
  translate = true,
  underline = true,
}: TextLinkProps) => {
  const Component = translate ? TranslatedLink : Link;
  return (
    <Component
      href={href}
      shallow={shallow}
      replace={replace}
      scroll={scroll}
      prefetch={prefetch}
      target={isExternal ? '_blank' : undefined}
    >
      <Text
        as={"span" as any}
        className={cn('flex flex-row hover:opacity-90', className, {
          'underline': underline,
        })}
      >
        {isExternal ? (
          <Balancer as="span">
            <span className="max-w-[100%] leading-relaxed">{children}</span>
            <Image
              priority
              src="/icons/external-link.svg"
              alt={alt || ''}
              height={12}
              width={12}
            />
          </Balancer>
        ) : (
          children
        )}
      </Text>
    </Component>
  );
};

export default TextLink;