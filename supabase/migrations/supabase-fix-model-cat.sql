-- AGREGAR Y POBLAR COLUMNAS model Y cat
alter table products 
add column if not exists model text,
add column if not exists cat text;

-- Actualizar model basado en descripcion
update products set 
  model = case 
    when descripcion ilike '%1061%' then '1061'
    when descripcion ilike '%1040%' then '1040'
    when descripcion ilike '%1037%' then '1037'
    when descripcion ilike '%1083%' then '1083'
    when descripcion ilike '%1027%' then '1027'
    when descripcion ilike '%4250%' then '4250'
    when descripcion ilike '%4251%' then '4251'
    when descripcion ilike '%1131%' then '1131'
    when descripcion ilike '%3130%' then '3130'
    else 'unknown'
  end;

-- Actualizar cat basado en descripcion
update products set 
  cat = case
    when descripcion ilike '%filtro%' then 'Filtros'
    when descripcion ilike '%motor%' or descripcion ilike '%turbo%' or descripcion ilike '%inyector%' or descripcion ilike '%bomba%agua%' or descripcion ilike '%damper%' or descripcion ilike '%arbol%levas%' or descripcion ilike '%valvula%' or descripcion ilike '%correa%tiempo%' or descripcion ilike '%tensor%' or descripcion ilike '%empac%valvula%' or descripcion ilike '%culata%' or descripcion ilike '%piston%' or descripcion ilike '%biela%' or descripcion ilike '%cigüeñal%' then 'Motor'
    when descripcion ilike '%alternador%' or descripcion ilike '%sensor%' or descripcion ilike '%rele%' or descripcion ilike '%arranque%' or descripcion ilike '%bujia%' or descripcion ilike '%bobina%' or descripcion ilike '%cable%bujia%' then 'Eléctrico'
    when descripcion ilike '%parabrisas%' or descripcion ilike '%tanque%combustible%' or descripcion ilike '%estribo%' or descripcion ilike '%manilla%' or descripcion ilike '%goma%perfil%' or descripcion ilike '%gooma%parabrisas%' or descripcion ilike '%carrocer%' or descripcion ilike '%logo%' or descripcion ilike '%espejo%' or descripcion ilike '%puerta%' or descripcion ilike '%tapa%tanq%' then 'Carrocería'
    when descripcion ilike '%embrague%' or descripcion ilike '%guaya%cambio%' or descripcion ilike '%palanca%cambio%' or descripcion ilike '%disco%embrague%' or descripcion ilike '%plato%embrague%' or descripcion ilike '%servo%embrague%' or descripcion ilike '%cruceta%' or descripcion ilike '%cardan%' then 'Transmisión'
    when descripcion ilike '%amortiguador%' or descripcion ilike '%muñon%' or descripcion ilike '%buje%' or descripcion ilike '%estribo%' or descripcion ilike '%chumacera%' then 'Suspensión'
    when descripcion ilike '%freno%' or descripcion ilike '%pastilla%' or descripcion ilike '%tuberia%freno%' or descripcion ilike '%valvula%freno%' or descripcion ilike '%pulmon%freno%' or descripcion ilike '%reservorio%' or descripcion ilike '%distribuidor%liga%' then 'Frenos'
    when descripcion ilike '%direccion%' or descripcion ilike '%bomba%direccion%' then 'Dirección'
    else 'Otros'
  end;

-- Verificar
select model, cat, count(*) from products group by model, cat order by model;