import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './LeftBar.module.css';
import logo_img from '../../assets/logo.png';


const LeftBar = () => {
    const location = useLocation();
    const { pathname } = location;
    
    const [isClosed, setIsClosed] = useState(localStorage.getItem('isClosed') === 'true' ? true : false);

    const isActive = (path) => {
        return pathname === path;
    }

    const section_LeftBar = (section_name, lista_itens) => {
        return (
            <div>
                <span className={styles['leftBar__title']}>{section_name}</span>
                <ul className={styles['leftBar__itens']}>
                    {lista_itens.map((item, index) => {
                        return (
                            <li className={isActive(item.path) ? styles["active"] : ''} key={index}>
                                <a href={item.path}>
                                    <span className="material-symbols-rounded">
                                        {item.icon}
                                    </span>

                                    <span>{item.label}</span>
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }

    if (isClosed) {
        document.body.style.paddingLeft = '80px';
    } else {
        document.body.style.paddingLeft = '287px';
    }

    const toggleMenu = () => {
        setIsClosed(!isClosed);
        localStorage.setItem('isClosed', !isClosed);
    }

    return (
        <nav className={`${styles['leftBar']} ${isClosed ? styles['closed'] : ''}`}>
            <span className={`material-symbols-outlined ${styles['menu']}`} onClick={toggleMenu}>
                 {isClosed ? 'left_panel_open' : 'left_panel_close'}
            </span>
            <div className={styles['leftBar__logo']}>
                <img src={logo_img} alt='Logo do Projeto Caixa de Sapato'/>
            </div>

            {section_LeftBar('Menu', [{
                label: 'Doações',
                path: '/doacoes',
                icon: 'volunteer_activism'
            }, {
                label: 'Histórico de doações',
                path: '/historico-doacoes',
                icon: 'description'
            }, {
                label: 'Pagamentos',
                path: '/pagamentos',
                icon: 'wallet'
            }, {
                label: 'Cupons',
                path: '/cupons',
                icon: 'card_giftcard'
            }
            ])}


            {section_LeftBar('Caixas', [{
                label: 'Itens de Doação',
                path: '/itens-doacao',
                icon: 'inventory_2'
            }
            ])}

            {section_LeftBar('Outros', [{
                label: 'Configurações',
                path: '/configuracoes',
                icon: 'settings'
            }, {
                label: 'Usuários',
                path: '/usuarios',
                icon: 'person'
            }, {
                label: 'Sair',
                path: '/logout',
                icon: 'logout'
            }
            ])}

        </nav>
    )
}

export default LeftBar;