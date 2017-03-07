<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Product;

class ProductController extends Controller
{
    public function main()
    {
        return view('products',['products'=>Product::all()]);
    }
}
