import React from "react";

export const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);

export const CreatePostIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 64 64" fill="currentColor">
        <title>Create Post</title>
        <g>
            <path d="M4,58a2,2,0,0,0,2,2H55a2,2,0,0,0,2-2V26a2,2,0,0,0-4,0V56H8V11H38a2,2,0,0,0,0-4H6A2,2,0,0,0,4,9Z"/>
            <path d="M54.05,4.15a2,2,0,0,0-2.83,0L23.61,31.76A2.05,2.05,0,0,0,23,33.17L23,39a2,2,0,0,0,2,2h0l5.85,0a1.94,1.94,0,0,0,1.4-.59L59.88,12.8a2,2,0,0,0,0-2.83ZM30,37l-3,0V34L52.63,8.39l3,3Z"/>
        </g>
    </svg>
);



export const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="6" y1="8" x2="18" y2="8" />   {/* Longest line */}
        <line x1="8" y1="12" x2="16" y2="12" /> {/* Medium line */}
        <line x1="10" y1="16" x2="14" y2="16" />{/* Shortest line */}
    </svg>
);


export const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

export const LogOutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <title>Log Out</title>
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <path d="M17,6.625 C17.5128358,6.625 17.9355072,7.01104019 17.9932723,7.50837887 L18,7.625 L18,15.125 C18,15.6772847 17.5522847,16.125 17,16.125 C16.4871642,16.125 16.0644928,15.7389598 16.0067277,15.2416211 L16,15.125 L16,7.625 C16,7.07271525 16.4477153,6.625 17,6.625 Z" fill="currentColor" fillRule="nonzero" transform="translate(17.000000, 11.375000) rotate(-90.000000) translate(-17.000000, -11.375000)" />
            <path d="M22.7792195,9.54507476 C23.1987232,9.18586019 23.8299991,9.23473418 24.1892136,9.65423787 C24.5484282,10.0737416 24.4995542,10.7050174 24.0800505,11.064232 L21.5800505,13.2049436 C21.2056869,13.5255054 20.6535832,13.5255054 20.2792195,13.2049436 L17.7792195,11.064232 C17.3597158,10.7050174 17.3108418,10.0737416 17.6700564,9.65423787 C18.029271,9.23473418 18.6605468,9.18586019 19.0800505,9.54507476 L20.929635,11.128365 L22.7792195,9.54507476 Z" fill="currentColor" fillRule="nonzero" transform="translate(20.929635, 11.375000) rotate(-90.000000) translate(-20.929635, -11.375000)" />
            <path d="M4.00117293,5.91494143 C4.47153853,6.20437994 4.61820891,6.82032287 4.3287704,7.29068847 C3.46425739,8.69560581 3,10.3124147 3,12 C3,16.9705627 7.02943725,21 12,21 C14.5009688,21 16.8360175,19.9761238 18.5251985,18.1985606 C18.905643,17.7982103 19.5386023,17.7820735 19.9389527,18.162518 C20.339303,18.5429625 20.3554398,19.1759218 19.9749953,19.5762722 C17.9120463,21.7471598 15.0548231,23 12,23 C5.92486775,23 1,18.0751322 1,12 C1,9.93964243 1.56831452,7.96044724 2.6254259,6.24253891 C2.91486441,5.77217331 3.53080733,5.62550293 4.00117293,5.91494143 Z M12,1 C14.6937549,1 17.2393787,1.97305656 19.2282058,3.70806373 C19.4769665,3.92507689 19.7159138,4.15314808 19.9442796,4.39153484 C20.3263314,4.79035168 20.3127406,5.42337078 19.9139238,5.80542258 C19.5151069,6.18747438 18.8820878,6.17388363 18.500036,5.77506679 C18.312958,5.57977949 18.1172117,5.39294295 17.9134369,5.21517448 C16.2855088,3.79500735 14.2056815,3 12,3 C11.2918394,3 10.5951093,3.08159661 9.91909567,3.2415374 C9.38164838,3.36869422 8.8428803,3.03608809 8.71572347,2.4986408 C8.58856665,1.96119351 8.92117278,1.42242543 9.45862007,1.2952686 C10.2852494,1.09969303 11.1364996,1 12,1 Z" fill="currentColor" fillRule="nonzero"/>
            <circle fill="currentColor" cx="6" cy="4" r="1"/>
        </g>
    </svg>
);

export const LogInIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <title>Log In</title>
        <g>
            {/* User circle */}
            <circle cx="12" cy="8" r="3" fill="currentColor"/>
            {/* User body */}
            <path d="M12 14c-4 0-7 2-7 4v2h14v-2c0-2-3-4-7-4z" fill="currentColor"/>
            {/* Login arrow */}
            <path d="M16 12l4-3v2h4v2h-4v2l-4-3z" fill="currentColor"/>
        </g>
    </svg>
);



