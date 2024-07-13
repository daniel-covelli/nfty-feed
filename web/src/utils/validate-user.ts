import { LoaderFunction, redirect } from 'react-router-dom';


export const validateUser: LoaderFunction = async () => {
  return redirect('/login')
  // let data: any;
  // try {
  //   const res = await fetch(
  //     `${
  //       process.env.NODE_ENV === 'production'
  //         ? `https://blooming-scrubland-30700.herokuapp.com`
  //         : `${process.env.REACT_APP_SERVER_URL}`
  //     }/refresh_token`,
  //     {
  //       method: 'POST',
  //       credentials: 'include'
  //     }
  //   );

  //   data = await res.json();
  // } catch (e) {
  //   return redirect('/error');
  // }
  // if (!data.accessToken) {
  //   console.log('data', JSON.stringify(data, null, 2));
  //   return redirect('/login');
  // }



  // return redirect('/home');
};
