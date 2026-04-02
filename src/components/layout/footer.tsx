export default function Footer (){

    return (
        <footer className="bg-white rounded shadow py-2 px-3 mb-1 mt-4 mx-3">
            <div className="row">
                <div className="col-12 col-md-4 col-xl-6 mb-4 mb-md-0">
                    <p className="mb-0 text-center text-lg-start">
                        
                    </p>
                </div>
                <div className="col-12 col-md-8 col-xl-6 text-center text-lg-start">
                    <ul
                        className="list-inline list-group-flush list-group-borderless text-md-end mb-0"
                    >
                        <li className="list-inline-item px-0 px-sm-2">
                      <a
                            className="text-primary fw-normal"
                            href="https://genixo.ai/"
                            target="_blank"
                        >  © 2026-<span className="current-year"></span> Genixo</a
                        >
                        </li>
                    </ul>
                </div>
            </div>
        </footer>
    )
}