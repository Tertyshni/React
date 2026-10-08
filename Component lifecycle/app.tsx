import { createBrowserRouter, RouterProvider, Link } from "react-router-dom";

import HomePage from "./pages/home.js";
import ProfilePage from "./pages/profile.js";
import RootLayout from "./root_layout.js";
import React from "react";
import ClassPage from "./pages/class_component.js";
import UseEffectPage from "./pages/use-effect.js";
import PropsPage from "./pages/props.js";
import UseRefPage from "./pages/use-ref.js";
import SmartDubmCompPage from "./pages/smart-dumb-comp.js";
import CoursePage from "./pages/course_page.js";
import AuthForm from "./pages/hook-form.js";
import ZodForm from "./pages/zod-resolver.js";
import UserPage from "./pages/user-page.js";


const NotFoundPage = ()=><div>
    <h1 className="text-7xl text-red-950 uppercase font-bold">404 Not Found. </h1>
    <Link to='/'>Go gome</Link>
</div>

const router = createBrowserRouter([
    {
        path:'/',
        element: <RootLayout/>,
        children:[
            {
                index: true,
                element: <HomePage/>
            },
            {
                path: 'profile/:id',
                element: <ProfilePage/>
            },
            {
                path: 'profile',
                element: <ProfilePage/>
            },
            {
                path: 'use-effect',
                element: <UseEffectPage/>
            },
            {
                path:"props",
                element:<PropsPage/>
            },
            {
                path: 'class-page',
                element: <ClassPage title="Class component"/>
            },
            {
                path:'use-ref',
                element: <UseRefPage/>
            },
            {
                path: 'smart-dumb',
                element: <SmartDubmCompPage/>
            },
            {
                path: 'zod-page',
                element: <CoursePage/>
            },
            {
                path: 'hook-form',
                element: <AuthForm/>
            },
            {
                path: 'zod-form',
                element: <ZodForm/>
            },
            {
                path:'user-page',
                element:<UserPage/>
            }
        ]
    },
    {
        path: '*',
        element: <NotFoundPage/>
    }
])

const App:React.FC = ()=>{
    return <RouterProvider router={router}/>
}
export default App;