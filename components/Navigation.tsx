import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { createClient } from '@supabase/supabase-js';
import { useStateContext } from '../context/StateContext';
import { useRouter } from 'next/navigation';

type Props = {
  showLinks: boolean;
};

const Navigation = (props: Props) => {
  const { setState } = useStateContext();
  const router = useRouter();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
  );

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.clear();
      setState({ session: null, user: null });
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-[rgba(238,217,212)] h-12 md:h-16 w-full text-xl px-[2rem]">
      <div className="md:flex max-w-7xl items-center justify-between hidden h-full m-auto">
        <div className="flex items-baseline flex-1 space-x-1">
          {props.showLinks && (
            <>
              <Link
                className="text-[rgba(219,96,53)] px-3 uppercase text-[.5rem] tracking-[.2em] lg:tracking-[.3em]  font-normal"
                href="/projects/new">
                + New Client
              </Link>
              <Link
                className="text-black px-3 uppercase text-[.5rem] tracking-[.2em] lg:tracking-[.3em]  font-normal"
                href="/">
                Clients
              </Link>
              <Link
                className="text-black px-3 uppercase text-[.5rem] tracking-[.2em] lg:tracking-[.3em] font-normal"
                href="/users">
                Planners
              </Link>
            </>
          )}
        </div>
        <div className=" lg:w-96 relative flex justify-center flex-shrink-0 w-1/4 h-full m-auto">
          <Link className="w-full h-full m-auto" href="/">
            <Image
              className="p-2"
              src="/images/DSE-Logo.svg"
              alt="DSE Logo"
              fill
            />
          </Link>
        </div>
        <div className="lg:flex-row-reverse lg:justify-normal flex justify-center flex-1">
          {props.showLinks && (
            <>
              <Link
                className="text-black px-3 uppercase text-[.5rem] tracking-[.3em] font-normal"
                href="">
                hi Kelsey
              </Link>{' '}
              <Link
                className="text-black px-3 uppercase text-[.5rem] tracking-[.3em] font-normal"
                rel="nofollow"
                onClick={() => {
                  handleSignOut();
                }}
                href="/logout">
                Log Out
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
